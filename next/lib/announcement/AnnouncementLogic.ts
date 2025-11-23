import AnnouncementClient from "./AnnouncementClient";
import {handleError} from "@/lib/common/ErrorHandler";
import {AnnouncementResDto} from "@/client";

export default class AnnouncementLogic {
  private announcementService: AnnouncementClient;

  constructor() {
    this.announcementService = new AnnouncementClient();
  }

  async fetchAnnouncement(): Promise<AnnouncementResDto> {
    try {
      return await this.announcementService.fetchAnnouncement();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch announcement");
    }
  }

  async updateAnnouncement(content: string): Promise<AnnouncementResDto> {
    try {
      return await this.announcementService.updateAnnouncement(content);
    } catch (error) {
      handleError(error, "Failed to update announcement");
    }
  }
}
