export interface NavigationTab {
  id: 'all' | 'trending' | 'favorites' | 'recent';
  label: string;
  icon: React.ElementType;
  count?: number;
}