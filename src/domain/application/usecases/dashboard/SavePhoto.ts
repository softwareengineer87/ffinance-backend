import { BusinessRepository } from "../../../../infra/repository/BusinessRepository";
import { Photo } from "../../../entities/Photo";

class SavePhoto {

  constructor(readonly businessRepository: BusinessRepository) { }

  async execute(businessId: string, url: string): Promise<Output> {
    const photo = Photo.create(businessId, url);
    await this.businessRepository.savePhoto(photo.photoId, photo.businessId, photo.url)
    console.log('ok...');

    return {
      photoId: photo.photoId
    }
  }

  convertPhotos(photos: File[]) {
    const photoNames = [];
    for (const photo of photos) {
      photoNames.push(photo.originalname);
    }
    return photoNames;
  }

}

type Output = {
  photoId: string;
}

export { SavePhoto }
