import AnnouncementClient from "./AnnouncementClient";
import axios from "axios";
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
      if (axios.isAxiosError(error)) {
        throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`);
      }
      console.error(error);
      throw new Error("Failed to update announcement");
    }
  }
}
