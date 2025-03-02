import AnnouncementClient from "./AnnouncementClient";
import axios from "axios";
import {Announcement} from "./Announcement";

export default class AnnouncementLogic {
  private announcementService: AnnouncementClient;

  constructor() {
    this.announcementService = new AnnouncementClient();
  }

  async fetchAnnouncement(): Promise<Announcement> {
    try {
      return await this.announcementService.fetchAnnouncement();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch announcement");
    }
  }

  async updateAnnouncement(content: string): Promise<Announcement> {
    try {
      return await this.announcementService.updateAnnouncement(content);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Unauthorized");
        }
        if (error.response?.status === 403) {
          throw new Error("Forbidden");
        }
      }
      console.error(error);
      throw new Error("Failed to update announcement");
    }
  }
}
