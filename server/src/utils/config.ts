const PORT: number = Number(process.env.PORT) || 3001;
const isProduction: boolean = process.env.NODE_ENV === "production";

export { PORT, isProduction };
