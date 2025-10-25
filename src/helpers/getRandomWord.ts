let words: string[] = [
    'COMPUTADORA',
    'AGUACATE',
    'PAPAYA',
    'VEHICULO',
    'ANIMAL',
    'VETERINARIO',
    'CELULAR',
    'TELEFONO',
    'AVION',
    'HELICOPTERO'
];


export function getRandomWord() {

    const randomIndex = Math.floor( Math.random() * words.length );
    return words[randomIndex];
    
}