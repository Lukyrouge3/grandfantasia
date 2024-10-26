// Examples
// 0x1 => Novice (1 << 0)
// 0x2401 => Novice, Priest, Spellcaster (1 << 0 | 1 << 10 | 1 << 13)
export function getClasses(restrict_class: string) {
	const bits = BigInt("0x" + restrict_class);
    let classes: number[] = [];
    for (let i = 0; i <= 61; i++) {
        if ((bits & 1n << BigInt(i)) != 0n) {
            classes.push(i);
        }
    }
    return classes;
}

export function getClassesStringFromList(classes: number[]): string {
    let bits = 0n;
    for (let i = 0; i < classes.length; i++) {
        bits |= 1n << BigInt(classes[i]);
    }
	if (bits == 0n) return "";
    return bits.toString(16).toUpperCase();
}