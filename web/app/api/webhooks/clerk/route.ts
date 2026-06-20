import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Prisma } from '@/generated/prisma';
import { prisma } from '@/config/prisma';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) throw new Error('Missing webhook secret');
    try {
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response('Error occured -- no svix headers', { status: 400 });
        }
        const payload = await req.json();
        const body = JSON.stringify(payload);
        const wh = new Webhook(WEBHOOK_SECRET);
        let evt: WebhookEvent
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            return new Response('Error occured', { status: 400 });
        }
        switch (evt.type) {
            case "user.created":
                const userCreationData = evt.data;
                const primaryEmail = userCreationData.email_addresses.find(
                    (email) => email.id === evt.data.primary_email_address_id
                )?.email_address || userCreationData.email_addresses[0]?.email_address;
                console.log("emails:", userCreationData.email_addresses)

                await prisma.user.upsert({
                    where: {
                        id: userCreationData.id,
                    },
                    create: {
                        id: userCreationData.id,
                        // Combine first and last name safely
                        fullName: `${userCreationData.first_name || ''} ${userCreationData.last_name || ''}`.trim(),
                        email: primaryEmail,
                        imageUrl: userCreationData.image_url,
                    },
                    update: {
                        // If it found a match by email but the ID was missing, 
                        // this links the existing record to the incoming Clerk ID safely
                        id: userCreationData.id,
                        email: primaryEmail,
                        imageUrl: userCreationData.image_url,
                    }
                });
                console.log("New User synced successfully:", userCreationData.id);
                break;

            case "user.deleted":
                const userDeletionData = evt.data;
                try {
                    await prisma.user.delete({ where: { id: userDeletionData.id } });
                    console.log("Successfully deleted user:", userDeletionData.id)
                } catch (err) {
                    // P2025 = record not found — treat as success since
                    // the end state (user doesn't exist) is what we wanted.
                    // This also handles duplicate webhook delivery for deletes.
                    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025')
                        return new Response("User no longer exists in the database", { status: 200 })
                    return new Response("Database error", { status: 500 });
                }
        }
        return new Response("", { status: 200 });
    } catch (err) {
        console.error("CRITICAL /api/webhooks/clerk error:", err);
        return new Response((err as any)?.message ?? "A server error occured", { status: 400 });
    }
}