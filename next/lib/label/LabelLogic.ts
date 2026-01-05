import {handleError} from "@/lib/common/ErrorHandler";
import LabelClient from "./LabelClient";
import {LabelResDto} from "@/client/nest";

export default class LabelLogic {
  private labelClient: LabelClient;

  constructor() {
    this.labelClient = new LabelClient();
  }

  async fetchLabels(): Promise<LabelResDto[]> {
    try {
      return await this.labelClient.fetchLabels();
    } catch (error) {
      handleError(error, 'Failed to fetch labels');
    }
  }

  async fetchLabel(id: number): Promise<LabelResDto> {
    try {
      return await this.labelClient.fetchLabel(id);
    } catch (error) {
      handleError(error, 'Failed to fetch label');
    }
  }

  async createLabel(name: string, color: string): Promise<LabelResDto> {
    try {
      return await this.labelClient.createLabel({name, color});
    } catch (error) {
      handleError(error, 'Failed to create label');
    }
  }

  async updateLabel(id: number, name: string, color: string): Promise<LabelResDto> {
    try {
      return await this.labelClient.updateLabel(id, {name, color});
    } catch (error) {
      handleError(error, 'Failed to update label');
    }
  }

  async deleteLabel(id: number): Promise<void> {
    try {
      await this.labelClient.deleteLabel(id);
    } catch (error) {
      handleError(error, 'Failed to delete label');
    }
  }
}
