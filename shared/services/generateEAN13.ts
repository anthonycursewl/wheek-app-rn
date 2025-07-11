export const generateEAN13 = (): string => {
    try {
      let base12 = '';
      for (let i = 0; i < 12; i++) {
        base12 += Math.floor(Math.random() * 10);
      }
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(base12[i]) * ((i % 2 === 0) ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      return base12 + checkDigit.toString();
    } catch (error) {
      console.error('Error generating EAN13:', error);
      return '';
    }
  };