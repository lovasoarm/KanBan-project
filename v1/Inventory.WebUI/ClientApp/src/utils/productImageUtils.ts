export const getProductImage = (productName: string): string => {
  const name = productName.toLowerCase();
  
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
  
  if (name.includes('watch') || name.includes('montre')) {
    return '/images/products/smartphone.png'; 
  }
  if (name.includes('speaker') || name.includes('haut-parleur') || name.includes('sound')) {
    return '/images/products/headphones.png'; 
  }
  if (name.includes('cable') || name.includes('câble') || name.includes('cord')) {
    return '/images/products/1.png'; 
  }
  if (name.includes('stand') || name.includes('support')) {
    return '/images/products/2.png'; 
  }
  if (name.includes('mouse') || name.includes('souris') || name.includes('keyboard') || name.includes('clavier')) {
    return '/images/products/3.png'; 
  }
  
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const imageNumber = Math.abs(hash) % 5 + 1;
  return `/images/products/${imageNumber}.png`;
};

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

