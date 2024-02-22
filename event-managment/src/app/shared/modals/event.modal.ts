export class Event {
  constructor(
    public _id: string,
    public orgaziser_id: string,
    public name: string,
    public venue: string,
    public description: string,
    public volunteers: string,
    public pay_per_volunteer: string,
    public start_date: string,
    public end_date: string,
    public days: string,
    public city: string,
    public state: string,
    public cover_img: string,
  ) {}
}
