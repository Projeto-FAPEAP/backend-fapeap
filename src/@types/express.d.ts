interface Field {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
declare namespace Express {
  export interface Request {
    files: {
      file: Field[];
    };
    user: {
      id: string;
    };
  }
}
