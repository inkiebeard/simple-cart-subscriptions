import { v4 as uuid } from 'uuid';

export interface IAddress {
  id: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string; // aka: zip
  country: string;
  phone?: string;
  created: Date;
  updated: Date;
  metadata: {
    [key: string]: any;
  }
}

class Address implements IAddress {
  id: string;
  name: string;
  address1: string;
  address2?: string | undefined;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string | undefined;
  created: Date;
  updated: Date;
  metadata: { [key: string]: any; };
  constructor(name: string, address1: string, city: string, state: string, postcode: string, country: string, address2?: string | undefined, phone?: string | undefined, metadata?: { [key: string]: any; }) {
    this.id = uuid();
    this.name = name;
    this.address1 = address1;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.postcode = postcode;
    this.country = country;
    this.phone = phone;
    this.created = new Date();
    this.updated = new Date();
    this.metadata = metadata || {};
  }
}

export default Address;