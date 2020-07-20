declare namespace Express {
  export interface Request {
    files: {
      imagens: any;
      video: any;
    };
    user: {
      id: string;
    };
  }
}
