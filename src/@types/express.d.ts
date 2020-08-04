interface Field {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  key: string;
  location: string;
  path: string;
  size: number;
}
declare namespace Express {
  export interface Request {
    files: Field[];
    user: {
      id: string;
    };
  }
}
