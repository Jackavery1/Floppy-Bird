export function getDailyChallengeCode(date = new Date()) {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 10000;
    }
    return String(hash).padStart(4, '0');
}

export function getDailyChallengeLabel(date = new Date()) {
    return `Défi du jour #${getDailyChallengeCode(date)}`;
}
