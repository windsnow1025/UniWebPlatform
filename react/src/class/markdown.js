import axios from 'axios';


export class Markdown {
    constructor(id) {
        this.id = id;
        this.title = "";
        this.content = "";

        this.token = null;
        this.instance = null;
        this.updateInstance();
    }

    updateInstance() {
        this.token = localStorage.getItem('token');
        this.instance = axios.create({
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }

    async fetchMarkdown() {
        this.updateInstance();
        try {
            const res = await this.instance.get('/api/markdown/' + this.id);
            const data = res.data;
            this.title = data.title;
            this.content = data.content;
        } catch (error) {
            console.log(error);
        }
    }

    async addMarkdown() {
        this.get_title_from_content();
        this.updateInstance();
        try {
            await this.instance.post('/api/markdown/', {
                data: {
                    title: this.title,
                    content: this.content
                }
            });
            alert('Add Success!')
        } catch (error) {
            if (error.response.status === 403) {
                alert('Unauthorized');
            }
        }
    }

    async updateMarkdown() {
        this.get_title_from_content();
        this.updateInstance();
        try {
            await this.instance.put('/api/markdown/', {
                data: {
                    id: this.id,
                    title: this.title,
                    content: this.content
                }
            });
            alert('Update Success!')
        } catch (error) {
            if (error.response.status === 403) {
                alert('Unauthorized');
            }
        }
    }

    async deleteMarkdown() {
        this.updateInstance();
        try {
            await this.instance.delete('/api/markdown/' + this.id);
            alert('Delete Success!')
        } catch (error) {
            if (error.response.status === 403) {
                alert('Unauthorized');
            }
        }
    }

    get_title_from_content() {
        this.title = this.content.split('\n')[0].replace('# ', '');
    }
}