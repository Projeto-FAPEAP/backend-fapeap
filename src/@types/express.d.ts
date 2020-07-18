declare namespace Express {
  export interface Request {
    body: {
      imagens: any;
      video: any;
    };
    user: {
      id: string;
    };
  }
}
