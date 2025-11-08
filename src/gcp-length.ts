import { gcpLengthBinary } from "./gcp-length-data.ts";

interface Node {
    length: number;

    childNodes: (Node | undefined)[];
}

let fromBinaryIndex = 0;

function fromBinary(childNodes: Node[]): void {
    const decompressedLengths = new Array<number>(10);

    for (let index = 0; index < 10; index += 2) {
        const byte = gcpLengthBinary[fromBinaryIndex++];

        decompressedLengths[index] = byte >> 4;
        decompressedLengths[index + 1] = byte & 0x0F;
    }

    for (let index = 0; index < 10; index++) {
        const length = decompressedLengths[index];

        if (length !== 0x0F) {
            const childNode = {
                length,
                childNodes: []
            };

            childNodes[index] = childNode;

            if (length === 0) {
                fromBinary(childNode.childNodes);
            }
        }
    }
}

const rootNode = {
    length: 0,
    childNodes: []
};

fromBinary(rootNode.childNodes);

export function normalizeGTIN(gtin: string): string {
    let normalizedGTIN: string;

    if (gtin.match(/^\d+$/)) {
        switch (gtin.length) {
            case 8:
                normalizedGTIN = "000000" + gtin;
                break;

            case 12:
                normalizedGTIN = "00" + gtin;
                break;

            case 13:
                normalizedGTIN = "0" + gtin;
                break;

            case 14:
                normalizedGTIN = gtin;
                break;

            default:
                normalizedGTIN = "";
                break;
        }
    } else {
        normalizedGTIN = "";
    }

    return normalizedGTIN;
}

export function getGCPLength(normalizedGTIN: string): number {
    let node: Node | undefined = rootNode;

    let digitIndex = 1;

    while (node !== undefined && node.length === 0) {
        node = node.childNodes[Number(normalizedGTIN.charAt(digitIndex++))];
    }

    return node?.length ?? 0;
}
