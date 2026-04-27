type Configs = {
  VERSION: string;
  APP_NAME: string;
  APP_LOGO: string;
  APP_ADMIN_LOGO: string;
  APP_LOGIN_IMAGE: string;
};

function env(key: string, defaultValue: string) {
  const value = import.meta.env[`VITE_CONFIG_${key}`];

  return value && value.length > 0 ? value : defaultValue;
}

const configs: Configs = {
  VERSION: env('VERSION', '1.0.0'),
  APP_NAME: env('APP_NAME', 'WingLab直播'),
  APP_LOGO: env('APP_LOGO', '/assets/icon-website.png'),
  APP_ADMIN_LOGO: env('APP_ADMIN_LOGO', '/assets/icon-admin.png'),
  APP_LOGIN_IMAGE: env('APP_LOGIN_IMAGE', '/assets/placeholder.svg'),
};

export default configs;
