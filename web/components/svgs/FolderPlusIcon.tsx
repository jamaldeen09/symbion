import React from 'react';

interface FolderPlusIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

export default function FolderPlusIcon({ size = 34, ...props }: React.SVGProps<SVGSVGElement> & {
    size?: number | string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 256 256"
            {...props}
        >
            <g
                style={{
                    stroke: 'none',
                    strokeWidth: 0,
                    strokeDasharray: 'none',
                    strokeLinecap: 'butt',
                    strokeLinejoin: 'miter',
                    strokeMiterlimit: 10,
                    fill: 'none',
                    fillRule: 'nonzero',
                    opacity: 1,
                }}
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
            >
                <path
                    d="M 1 66.006 v 10.902 c 0 2.47 2.002 4.472 4.472 4.472 h 79.057 c 2.47 0 4.472 -2.002 4.472 -4.472 v -49.15 c 0 -2.47 -2.002 -4.472 -4.472 -4.472 H 49.17 c -2.677 0 -5.251 -1.03 -7.189 -2.877 l -9.351 -8.912 C 30.692 9.65 28.118 8.62 25.441 8.62 H 5.472 C 3.002 8.62 1 10.622 1 13.092 v 10.195 v 29.005"
                    style={{
                        stroke: 'none',
                        strokeWidth: 1,
                        strokeDasharray: 'none',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeMiterlimit: 10,
                        fill: 'rgb(255,196,49)',
                        fillRule: 'nonzero',
                        opacity: 1,
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                />
                <path
                    d="M 84.528 82.38 H 5.472 C 2.455 82.38 0 79.926 0 76.908 V 66.006 c 0 -0.553 0.448 -1 1 -1 s 1 0.447 1 1 v 10.902 c 0 1.914 1.558 3.472 3.472 3.472 h 79.057 c 1.914 0 3.472 -1.558 3.472 -3.472 v -49.15 c 0 -1.914 -1.558 -3.472 -3.472 -3.472 H 49.17 c -2.947 0 -5.745 -1.12 -7.878 -3.153 l -9.352 -8.912 c -1.76 -1.678 -4.068 -2.602 -6.499 -2.602 H 5.472 C 3.558 9.62 2 11.178 2 13.092 v 39.199 c 0 0.553 -0.448 1 -1 1 s -1 -0.447 -1 -1 V 13.092 C 0 10.075 2.455 7.62 5.472 7.62 h 19.969 c 2.947 0 5.745 1.12 7.879 3.154 l 9.352 8.912 c 1.76 1.677 4.068 2.601 6.499 2.601 h 35.358 c 3.018 0 5.472 2.455 5.472 5.472 v 49.15 C 90 79.926 87.546 82.38 84.528 82.38 z"
                    style={{
                        stroke: 'none',
                        strokeWidth: 1,
                        strokeDasharray: 'none',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeMiterlimit: 10,
                        fill: 'rgb(0,0,0)',
                        fillRule: 'nonzero',
                        opacity: 1,
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                />
                <path
                    d="M 45 62.081 c -0.552 0 -1 -0.447 -1 -1 V 40.919 c 0 -0.552 0.448 -1 1 -1 s 1 0.448 1 1 v 20.162 C 46 61.634 45.552 62.081 45 62.081 z"
                    style={{
                        stroke: 'none',
                        strokeWidth: 1,
                        strokeDasharray: 'none',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeMiterlimit: 10,
                        fill: 'rgb(0,0,0)',
                        fillRule: 'nonzero',
                        opacity: 1,
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                />
                <path
                    d="M 55.081 52 H 34.919 c -0.552 0 -1 -0.447 -1 -1 s 0.448 -1 1 -1 h 20.162 c 0.553 0 1 0.447 1 1 S 55.634 52 55.081 52 z"
                    style={{
                        stroke: 'none',
                        strokeWidth: 1,
                        strokeDasharray: 'none',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeMiterlimit: 10,
                        fill: 'rgb(0,0,0)',
                        fillRule: 'nonzero',
                        opacity: 1,
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}