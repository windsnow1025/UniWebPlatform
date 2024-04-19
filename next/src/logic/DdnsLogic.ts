import Cloudflare from 'cloudflare';

export class DdnsLogic {
    private cloudflare: Cloudflare;
    private dnsRecordName: string;

    constructor(cloudflareEmail: string, cloudflareApiKey: string, dnsRecordName: string) {
        this.cloudflare = new Cloudflare({
            apiEmail: cloudflareEmail,
            apiKey: cloudflareApiKey,
        });
        this.dnsRecordName = dnsRecordName;
    }

    // async main() {
    //     const zone = await this.cloudflare.zones.create({
    //         account: { id: '023e105f4ecef8ad9ca31a8372d0c353' },
    //         name: 'example.com',
    //         type: 'full',
    //     });
    //
    //     console.log(zone.id);
    // }
}
