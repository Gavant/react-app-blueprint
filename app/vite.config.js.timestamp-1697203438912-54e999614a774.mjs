// vite.config.js
import path from "node:path";
import react from "file:///Users/adambaker/Development/gavant/react-app-blueprint/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { run } from "file:///Users/adambaker/Development/gavant/react-app-blueprint/node_modules/good-fences/lib/index.js";
import { defineConfig } from "file:///Users/adambaker/Development/gavant/react-app-blueprint/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/adambaker/Development/gavant/react-app-blueprint/app";
var port = 5425;
var vite_config_default = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: true,
              apply: "serve"
            }
          ]
        ]
      }
    }),
    {
      name: "HRM-fence-check",
      // TODO: This executes twice. Unsure how to fix it at present. Clearing logs for now.
      handleHotUpdate: async ({ modules, server }) => {
        run({
          project: "./tsconfig.json",
          rootDir: "./src",
          progressBar: false,
          looseRootFileDiscovery: true,
          ignoreExternalFences: true
        }).then((result) => {
          var _a;
          console.clear();
          if (result.errors.length) {
            console.error("\u{1328F} Violation in ...");
            (_a = result == null ? void 0 : result.errors) == null ? void 0 : _a.forEach((error) => {
              console.log(error.detailedMessage);
            });
          } else {
            console.log(`Vite dev server running on port: ${port}`);
          }
        });
        return modules;
      }
    }
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "~": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  },
  server: {
    port
  },
  test: {
    globals: true,
    setupFiles: "vitest/setup.ts",
    environment: "jsdom"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWRhbWJha2VyL0RldmVsb3BtZW50L2dhdmFudC9yZWFjdC1hcHAtYmx1ZXByaW50L2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FkYW1iYWtlci9EZXZlbG9wbWVudC9nYXZhbnQvcmVhY3QtYXBwLWJsdWVwcmludC9hcHAvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FkYW1iYWtlci9EZXZlbG9wbWVudC9nYXZhbnQvcmVhY3QtYXBwLWJsdWVwcmludC9hcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgcnVuIH0gZnJvbSAnZ29vZC1mZW5jZXMnO1xuXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cblxuLy8gS0lDS1xuY29uc3QgcG9ydCA9IDU0MjU7XG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3Qoe1xuICAgICAgICAgICAgYmFiZWw6IHtcbiAgICAgICAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYWJlbC1wbHVnaW4tc3R5bGVkLWNvbXBvbmVudHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5OiAnc2VydmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdIUk0tZmVuY2UtY2hlY2snLFxuICAgICAgICAgICAgLy8gVE9ETzogVGhpcyBleGVjdXRlcyB0d2ljZS4gVW5zdXJlIGhvdyB0byBmaXggaXQgYXQgcHJlc2VudC4gQ2xlYXJpbmcgbG9ncyBmb3Igbm93LlxuICAgICAgICAgICAgaGFuZGxlSG90VXBkYXRlOiBhc3luYyAoeyBtb2R1bGVzLCBzZXJ2ZXIgfSkgPT4ge1xuICAgICAgICAgICAgICAgIHJ1bih7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Q6ICcuL3RzY29uZmlnLmpzb24nLFxuICAgICAgICAgICAgICAgICAgICByb290RGlyOiAnLi9zcmMnLFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0JhcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGxvb3NlUm9vdEZpbGVEaXNjb3Zlcnk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZUV4dGVybmFsRmVuY2VzOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignXHVEODBDXHVERThGIFZpb2xhdGlvbiBpbiAuLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdD8uZXJyb3JzPy5mb3JFYWNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLmRldGFpbGVkTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBWaXRlIGRldiBzZXJ2ZXIgcnVubmluZyBvbiBwb3J0OiAke3BvcnR9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kdWxlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICAgICAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBpZC5zcGxpdChcIi9ub2RlX21vZHVsZXMvXCIpLnBvcCgpPy5zcGxpdChcIi9cIilbMF07IC8vIGlmIHdlIHdhbnQgdG8gY2h1bmsgZXZlcnkgaW5kaXZpZHVhbCBtb2R1bGUuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwb3J0OiBwb3J0LFxuICAgIH0sXG4gICAgdGVzdDoge1xuICAgICAgICBnbG9iYWxzOiB0cnVlLFxuICAgICAgICBzZXR1cEZpbGVzOiAndml0ZXN0L3NldHVwLnRzJyxcbiAgICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxPQUFPLFVBQVU7QUFFcFgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsV0FBVztBQUdwQixTQUFTLG9CQUFvQjtBQU43QixJQUFNLG1DQUFtQztBQVd6QyxJQUFNLE9BQU87QUFDYixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsTUFDRixPQUFPO0FBQUEsUUFDSCxTQUFTO0FBQUEsVUFDTDtBQUFBLFlBQ0k7QUFBQSxZQUNBO0FBQUEsY0FDSSxhQUFhO0FBQUEsY0FDYixVQUFVO0FBQUEsY0FDVixPQUFPO0FBQUEsWUFDWDtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0osQ0FBQztBQUFBLElBQ0Q7QUFBQSxNQUNJLE1BQU07QUFBQTtBQUFBLE1BRU4saUJBQWlCLE9BQU8sRUFBRSxTQUFTLE9BQU8sTUFBTTtBQUM1QyxZQUFJO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsVUFDVCxhQUFhO0FBQUEsVUFDYix3QkFBd0I7QUFBQSxVQUN4QixzQkFBc0I7QUFBQSxRQUMxQixDQUFDLEVBQUUsS0FBSyxDQUFDLFdBQVc7QUF0Q3BDO0FBdUNvQixrQkFBUSxNQUFNO0FBQ2QsY0FBSSxPQUFPLE9BQU8sUUFBUTtBQUN0QixvQkFBUSxNQUFNLDRCQUFxQjtBQUNuQyxtREFBUSxXQUFSLG1CQUFnQixRQUFRLENBQUMsVUFBVTtBQUMvQixzQkFBUSxJQUFJLE1BQU0sZUFBZTtBQUFBLFlBQ3JDO0FBQUEsVUFDSixPQUFPO0FBQ0gsb0JBQVEsSUFBSSxvQ0FBb0MsSUFBSSxFQUFFO0FBQUEsVUFDMUQ7QUFBQSxRQUNKLENBQUM7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUE7QUFBQSxNQUVILEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUN0QztBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGFBQWEsSUFBSTtBQUNiLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUU3QixtQkFBTztBQUFBLFVBQ1g7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNGLFNBQVM7QUFBQSxJQUNULFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxFQUNqQjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
