import { v4 as uuidv4 } from 'uuid';
class Photo {

  photoId: string;
  businessId: string;
  url: string;

  constructor(photoId: string, businessId: string, url: string) {
    this.photoId = photoId;
    this.businessId = businessId;
    this.url = url;
  }

  static create(businessId: string, url: string) {
    const photoId = uuidv4();
    return new Photo(photoId, businessId, url);
  }

}

export { Photo }
