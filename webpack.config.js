import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

export const resolve = {
	plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
};
