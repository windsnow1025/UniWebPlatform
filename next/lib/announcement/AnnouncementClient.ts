import {AnnouncementApi, AnnouncementResDto} from "@/client/nest";
import {getNestOpenAPIConfiguration} from "@/lib/common/APIConfig";

export default class AnnouncementClient {
  async fetchAnnouncement(): Promise<AnnouncementResDto> {
    const api = new AnnouncementApi(getNestOpenAPIConfiguration());
    const res = await api.announcementControllerFind();
    return res.data;
  }

  async updateAnnouncement(content: string): Promise<AnnouncementResDto> {
    const api = new AnnouncementApi(getNestOpenAPIConfiguration());
    const res = await api.announcementControllerUpdate({
      content: content
    });
    return res.data;
  }
}