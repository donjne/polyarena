export interface NFTAsset {
    id: string;
    name: string;
    description: string;
    type: 'avatar' | 'skin' | 'accessory' | 'effect' | 'badge';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    preview: string; // URL to preview image/model
    attributes: {
      [key: string]: string | number | boolean;
    };
    creator: string;
    owner: string | null;
    price: string;
    currency: 'SOL' | 'USDC';
    listingStatus: 'listed' | 'unlisted' | 'sold';
    mintAddress: string;
    createdAt: number;
    lastSalePrice?: string;
    saleHistory: {
      price: string;
      from: string;
      to: string;
      timestamp: number;
    }[];
  }
  
  export interface NFTCollection {
    id: string;
    name: string;
    description: string;
    creator: string;
    coverImage: string;
    items: number;
    floorPrice: string;
    totalVolume: string;
    verified: boolean;
  }