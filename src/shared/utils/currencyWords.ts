export function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero';

  const singleDigit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const doubleDigit = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tensPlace = [
    '',
    'Ten',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const convertTens = (n: number) => {
    if (n < 10) return singleDigit[n];
    if (n < 20) return doubleDigit[n - 10];
    return tensPlace[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + singleDigit[n % 10] : '');
  };

  const convertHundreds = (n: number) => {
    let str = '';
    if (n > 99) {
      str += singleDigit[Math.floor(n / 100)] + ' Hundred ';
      n = n % 100;
    }
    if (n > 0) {
      str += convertTens(n);
    }
    return str.trim();
  };

  let word = '';
  let wholeNumber = Math.floor(num);
  const decimal = Math.round((num - wholeNumber) * 100);

  if (wholeNumber > 9999999) {
    word += convertHundreds(Math.floor(wholeNumber / 10000000)) + ' Crore ';
    wholeNumber %= 10000000;
  }
  if (wholeNumber > 99999) {
    word += convertHundreds(Math.floor(wholeNumber / 100000)) + ' Lakh ';
    wholeNumber %= 100000;
  }
  if (wholeNumber > 999) {
    word += convertHundreds(Math.floor(wholeNumber / 1000)) + ' Thousand ';
    wholeNumber %= 1000;
  }
  if (wholeNumber > 0) {
    word += convertHundreds(wholeNumber);
  }

  word = word.trim();

  if (decimal > 0) {
    word += ' and ' + convertTens(decimal) + ' Paise';
  }

  return word + ' Only';
}
