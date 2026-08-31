export const getCategoryMapping = (label: string) => {
  if (label === 'battery') return 'B3';
  if (label === 'biological') return 'Organik';
  return 'Anorganik';
};

export const getHumanReadableName = (label: string) => {
  const map: Record<string, string> = {
    'battery': 'Baterai Bekas',
    'biological': 'Sisa Makanan',
    'brown-glass': 'Kaca Coklat',
    'cardboard': 'Kardus',
    'green-glass': 'Kaca Hijau',
    'metal': 'Kaleng / Logam',
    'paper': 'Kertas',
    'plastic': 'Plastik',
    'trash': 'Sampah Campur',
    'white-glass': 'Kaca Bening'
  };
  return map[label] || label;
};

export const getBasePrice = (label: string) => {
  const map: Record<string, string> = {
    'battery': '1000',
    'biological': '1500',
    'brown-glass': '2000',
    'cardboard': '2000',
    'green-glass': '2000',
    'metal': '12000',
    'paper': '1500',
    'plastic': '3500',
    'trash': '500',
    'white-glass': '2500'
  };
  return map[label] || '0';
};

export const samplePhotos = [
  {
    name: "Baterai",
    url: "https://images.unsplash.com/photo-1608224873587-81ee37394b4e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "battery",
    title: "Baterai AA Bekas",
    price: "1000",
  },
  {
    name: "Sisa Makanan",
    url: "https://plus.unsplash.com/premium_photo-1723373960718-c26efde88d6d?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "biological",
    title: "Sampah Organik Basah",
    price: "1500",
  },
  {
    name: "Kaca Coklat",
    url: "https://images.unsplash.com/photo-1764109807172-acec712df813?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "brown-glass",
    title: "Botol Kaca Coklat",
    price: "2000",
  },
  {
    name: "Kardus",
    url: "https://plus.unsplash.com/premium_photo-1756454859207-6c03521d90da?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "cardboard",
    title: "Kardus Bekas",
    price: "2000",
  },
  {
    name: "Kaca Hijau",
    url: "https://images.unsplash.com/photo-1654718421032-8aee5603b51f?q=80&w=1125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "green-glass",
    title: "Botol Kaca Hijau",
    price: "2000",
  },
  {
    name: "Metal",
    url: "https://images.unsplash.com/photo-1657742239061-64b6de9e0c4a?q=80&w=1630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "metal",
    title: "Kaleng Minuman",
    price: "12000",
  },
  {
    name: "Kertas",
    url: "https://images.unsplash.com/photo-1654372066379-d8a1c70f7363?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "paper",
    title: "Kertas Bekas",
    price: "1500",
  },
  {
    name: "Plastik",
    url: "https://images.unsplash.com/photo-1571727153934-b9e0059b7ab2?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "plastic",
    title: "Botol Plastik PET",
    price: "3500",
  },
  {
    name: "Sampah",
    url: "https://plus.unsplash.com/premium_photo-1663099654523-d3862b7742cd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    targetLabel: "trash",
    title: "Sampah Campur",
    price: "500",
  },
  {
    name: "Kaca Bening",
    url: "https://thumbs.dreamstime.com/b/waste-glass-various-broken-bottles-isolated-white-background-197813246.jpg",
    targetLabel: "white-glass",
    title: "Botol Kaca Bening",
    price: "2500",
  }
];
