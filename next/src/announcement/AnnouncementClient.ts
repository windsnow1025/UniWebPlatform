import {getNestAxiosInstance} from "@/src/common/APIConfig";
import {Announcement} from "./Announcement";

export default class AnnouncementClient {
  async fetchAnnouncement(): Promise<Announcement> {
    const res = await getNestAxiosInstance().get('/announcement');
    return res.data;
  }

  async updateAnnouncement(content: string): Promise<Announcement> {
    const token = localStorage.getItem('token');
    const res = await getNestAxiosInstance().put('/announcement', {
        content: content
      }, {
        headers: {Authorization: `Bearer ${token}`},
      }
    );
    return res.data;
  }
}