export class Order {
  order_id: string;
  name: string;
  email: string;
  pickup_store: any;
  amount: number;
  details: any;
  products: string;
  tracking_numbers: string;
  date : Date;

  static from(obj: any) {
    let o = new Order();
    Object.assign(o, obj);
    o.products = o.productsFromDetails();
    o.date = new Date(o.date);
    return o;
  }

  getImages(size : string) {
    if (!size) return this.details.images;
    const sz = size.split(' ')[0];
    const pt = size.split(' ')[1];
    if (this.details.images === undefined) return [];
    let imgs = [];
    for (let i = 0; i < this.details.images.length; ++i) {
      let img = this.details.images[i];
      let productType = this.getProductType(img.productId);
      if (img.size === sz && productType === pt) {
        imgs.push(img);
      }
    }
    return imgs;
  }

  getSizes() {
    if (this.details.images === undefined) return {};
    let sizes = {};
    for (let i = 0; i < this.details.images.length; ++i) {
      let img = this.details.images[i];
      let productType = this.getProductType(img.productId);
      sizes[`${img.size} ${productType}`] = true;
    }
    return Object.keys(sizes);
  }

  getProductType(productId) {
    switch (productId) {
      case 'PRGift;5475':
      case '4x6':
      case '5x7':
      case '8x10':
      case 'Print;1010':
      case 'PRGift;5343':
      case '?':
        return 'Prints';
      case 'PRGift;4113':
      case 'PRGift;4214':
      case 'PRGift;4110':
      case 'PRGift;5907':
        return 'Posters';
      case 'PRGift;5812':
      case 'PRGift;5136':
      case 'PRGift;5137':
        return 'Canvas';
      default:
        return 'Unknown';
    }
  }

  productsFromDetails() {
    if (this.details.images === undefined) return '';
    let prods = {};
    for (let i = 0; i < this.details.images.length; ++i) {
      let img = this.details.images[i];
      let sz = img.size;
      let qty = img.qty;
      let prod = this.getProductType(img.productId);
      let key = `${sz} ${prod}`;
      let count = prods[key] === undefined ? 0 : prods[key];
      prods[key] = count + qty;
    }
    let prodsStr = [];
    let keys = Object.keys(prods);
    for (let i = 0; i < keys.length; ++i) {
      let key = keys[i];
      prodsStr.push(`${key.replace(' Prints', '')} (${prods[key]})`);
    }
    return prodsStr.join(', ');
  }

  getTrackingNumbers() {
    return this.tracking_numbers ? this.tracking_numbers.split(',') : [];
  }

  getTrackingLink(tn) {
    return tn.length === 12 ? 
    `https://www.fedex.com/apps/fedextrack/?tracknumbers=${tn}&cntry_code=us` :
    `https://www.ups-mi.net/packageID/packageid.aspx?pid=${tn}`
  }
}