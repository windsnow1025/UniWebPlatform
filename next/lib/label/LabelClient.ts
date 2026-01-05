import {getNestOpenAPIConfiguration} from "@/lib/common/APIConfig";
import {LabelReqDto, LabelResDto, LabelsApi} from "@/client/nest";

export default class LabelClient {
  async fetchLabels(): Promise<LabelResDto[]> {
    const api = new LabelsApi(getNestOpenAPIConfiguration());
    const res = await api.labelsControllerFind();
    return res.data;
  }

  async fetchLabel(id: number): Promise<LabelResDto> {
    const api = new LabelsApi(getNestOpenAPIConfiguration());
    const res = await api.labelsControllerFindOne(id);
    return res.data;
  }

  async createLabel(label: LabelReqDto): Promise<LabelResDto> {
    const api = new LabelsApi(getNestOpenAPIConfiguration());
    const res = await api.labelsControllerCreate(label);
    return res.data;
  }

  async updateLabel(id: number, label: LabelReqDto): Promise<LabelResDto> {
    const api = new LabelsApi(getNestOpenAPIConfiguration());
    const res = await api.labelsControllerUpdate(id, label);
    return res.data;
  }

  async deleteLabel(id: number): Promise<void> {
    const api = new LabelsApi(getNestOpenAPIConfiguration());
    await api.labelsControllerDelete(id);
  }
}
