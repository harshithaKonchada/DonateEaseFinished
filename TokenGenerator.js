export function tokenGenerator() 
{
    const stringLen = Math.floor(Math.random() * (4 - 2 + 1) + 2);
    let randValue;
    let str = "";
    let letter;

    for (let i = 0; i < stringLen; i++) {
        // Generating a random number.
        randValue = Math.floor(Math.random() * (26 - 0 + 1) + 0);

        // converting the random number into character.
        letter = String.fromCharCode(randValue + 65);

        // Appending the letter to string.
        str = str + letter + randValue.toString();
    }

    return str;
}