npm cache clean --force
npm install --no-package-lock
npx sequelize-cli db:migrate
npm start