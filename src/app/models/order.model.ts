export class Order {
  order_id: string;
  name: string;
  email: string;
  pickup_store: any;
  amount: number;
  details: any;
  products: string;
  date : Date;

  static from(obj: any) {
    let o = new Order();
    Object.assign(o, obj);
    o.products = o.productsFromDetails();
    o.date = new Date(o.date);
    return o;
  }

  getImages() {
    return this.details.images;
  }

  productsFromDetails() {
    let prods = {};
    for (let i = 0; i < this.details.images.length; ++i) {
      let img = this.details.images[i];
      let sz = img.size;
      let qty = img.qty;
      let count = prods[sz] === undefined ? 0 : prods[sz];
      prods[sz] = count + qty;
    }
    let prodsStr = [];
    let keys = Object.keys(prods);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      prodsStr.push(`${key} (${prods[key]})`);
    }
    return prodsStr.join(', ');
  }
}