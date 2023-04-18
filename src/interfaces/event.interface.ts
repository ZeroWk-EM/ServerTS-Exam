export interface IEvent {
  name: string;
  typology: "Sport" | "Convention" | "Fair" | "Concert";
  availablePlaces: number;
  location: {
    city: string;
    address: string;
    postalCode: string;
  };
  ticketsPrice: number;
}
