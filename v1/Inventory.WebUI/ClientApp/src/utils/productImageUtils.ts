// Function to get appropriate product image based on product name
export const getProductImage = (productName: string): string => {
  const name = productName.toLowerCase();
  
  // Check for specific product types and map to appropriate images
  if (name.includes('headphone') || name.includes('écouteur') || name.includes('casque') || name.includes('audio')) {
    return '/images/products/headphones.png';
  }
  if (name.includes('laptop') || name.includes('ordinateur') || name.includes('portable') || name.includes('computer')) {
    return '/images/products/laptop.png';
  }
  if (name.includes('monitor') || name.includes('écran') || name.includes('moniteur') || name.includes('display')) {
    return '/images/products/monitor.png';
  }
  if (name.includes('phone') || name.includes('smartphone') || name.includes('téléphone') || name.includes('mobile') || name.includes('iphone')) {
    return '/images/products/smartphone.png';
  }
  
  // Add more specific mappings for common electronics
  if (name.includes('watch') || name.includes('montre')) {
    return '/images/products/smartphone.png'; // Use smartphone as fallback for smartwatch
  }
  if (name.includes('speaker') || name.includes('haut-parleur') || name.includes('sound')) {
    return '/images/products/headphones.png'; // Use headphones for audio devices
  }
  if (name.includes('cable') || name.includes('câble') || name.includes('cord')) {
    return '/images/products/1.png'; // Use generic image for cables
  }
  if (name.includes('stand') || name.includes('support')) {
    return '/images/products/2.png'; // Use generic image for stands
  }
  if (name.includes('mouse') || name.includes('souris') || name.includes('keyboard') || name.includes('clavier')) {
    return '/images/products/3.png'; // Use generic image for peripherals
  }
  
  // Default fallback to numbered images based on name hash
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const imageNumber = Math.abs(hash) % 5 + 1;
  return `/images/products/${imageNumber}.png`;
};

// Function to determine stock status color and label
export const getStockStatus = (quantity: number) => {
  if (quantity <= 5) {
    return {
      label: 'Critical',
      backgroundColor: 'rgba(255, 0, 0, 0.2)', 
      color: '#FF0000',
      animation: 'pulse 2s infinite'
    };
  } else if (quantity <= 15) {
    return {
      label: 'Low',
      backgroundColor: 'rgba(255, 149, 0, 0.2)',
      color: '#FF9500',
      animation: 'none'
    };
  } else {
    return {
      label: 'Normal',
      backgroundColor: 'rgba(52, 199, 89, 0.2)',
      color: '#34C759',
      animation: 'none'
    };
  }
};
