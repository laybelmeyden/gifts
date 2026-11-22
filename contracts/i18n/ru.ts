import type { PluralForms } from './types';

export const ru = {
  meta: {
    description: 'Список подарков твоей мечты',
    titles: {
      signIn: 'вход',
      signUp: 'регистрация',
      myLists: 'мои вишлисты',
      profile: 'профиль',
      admin: 'админка',
      board: 'список подарков',
      rules: 'пользовательское соглашение',
      notFound: 'страница не найдена',
    },
  },

  common: {
    toHome: 'На главную',
    signIn: 'Войти',
    signOut: 'Выйти',
    close: 'Закрыть',
    soon: 'Это появится следующим шагом',
    loading: 'Загружаем ваши подарки',
    defaultName: 'Мечтатель',
    networkError: 'Нет сети или сервер недоступен',
    serverError: 'Сервер ответил ошибкой. Попробуйте ещё раз',
    handleLevel: (handle: string, level: number) => `@${handle} · LV ${level}`,
  },

  fields: {
    name: 'Имя',
    email: 'Почта',
    password: 'Пароль',
    handle: 'Ник для ссылки',
    birthday: 'День рождения',
    emailPlaceholder: 'example@mail.com',
    passwordPlaceholder: '******',
    birthdayPlaceholder: 'дд.мм',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
  },

  nav: {
    label: 'Разделы',
    myLists: 'Мои вишлисты',
    friends: 'Друзья',
    giving: 'Я дарю',
    calendar: 'Календарь',
    profile: 'Профиль',
    newList: 'Новый вишлист',
    tabs: {
      lists: 'Вишлисты',
      friends: 'Друзья',
      giving: 'Я дарю',
      profile: 'Профиль',
    },
  },

  home: {
    signIn: 'Войти',
    createList: 'Создать вишлист',
    eyebrowDesktop: 'Вишлист для своих',
    eyebrowMobile: 'Вишлист без намёков',
    titleTop: 'Список подарков',
    titleBottom: 'твоей мечты',
    leadDesktop: 'Собери все желания в одном месте, отправь ссылку подругам - и получай только то, о чём давно мечтаешь',
    leadMobile: 'Собери желания в один список, отправь ссылку - и получай только то, о чём мечтаешь',
    quotes: [
      '* Ты достойна именно тех подарков, о которых мечтаешь',
      '* Подарок говорит то, что голос стесняется',
      '* Даже маленький сюрприз может отогреть целый день',
      '* Не цена делает подарок. Делает взгляд, с которым его отдают',
    ],
  },

  auth: {
    signIn: {
      title: 'С возвращением!',
      subtitle: 'Твои списки желаний ждут тебя',
      submit: 'Войти',
    },
    signUp: {
      title: 'Создадим твой первый вишлист',
      subtitle: 'Это бесплатно и займёт минуту',
      submit: 'Создать аккаунт',
    },
    tabSignIn: 'Вход',
    tabSignUp: 'Регистрация',
    nameLabel: 'Как тебя зовут',
    namePlaceholder: 'Огафий-чан',
    forgotPassword: 'Забыли пароль?',
    termsBefore: 'Нажимая «Создать аккаунт», ты соглашаешься с ',
    termsLink: 'правилами сервиса',
    termsAfter: '.',
    forgot: {
      title: 'Забыли пароль?',
      lead: 'Пришлём ссылку для нового пароля на почту',
      submit: 'Прислать ссылку',
      soon: 'Отправка писем появится следующим шагом',
    },
    errors: {
      invalidCredentials: 'Неверная почта или пароль',
      emailRegistered: 'Эта почта уже зарегистрирована',
      invalidEmail: 'Некорректная почта',
      passwordTooShort: 'Пароль слишком короткий',
      passwordTooLong: 'Пароль слишком длинный',
      tooManyAttempts: 'Слишком много попыток. Подождите минуту',
      unknown: 'Не получилось. Попробуйте ещё раз',
    },
  },

  validation: {
    emailRequired: 'Введите почту',
    emailTooLong: 'Слишком длинная почта',
    emailInvalid: 'Некорректная почта',
    passwordRequired: 'Введите пароль',
    passwordMin: (min: number) => `Пароль - минимум ${min} символов`,
    passwordMax: (max: number) => `Пароль - максимум ${max} символов`,
    nameRequired: 'Как тебя зовут?',
    nameMax: (max: number) => `Имя - максимум ${max} символов`,
    handleMin: (min: number) => `Ник - минимум ${min} символа`,
    handleMax: (max: number) => `Ник - максимум ${max} символа`,
    handleFormat: 'Только латиница, цифры и подчёркивание. С буквы',
    handleReserved: 'Этот ник нельзя занять',
    birthdayFormat: 'Введите дату как дд.мм',
  },

  api: {
    unauthorized: 'Нужно войти',
    invalidJson: 'Некорректный запрос',
    checkFields: 'Проверьте поля',
    handleTaken: 'Этот ник уже занят',
    emailTaken: 'Эта почта уже занята',
    userNotFound: 'Пользователь не найден',
  },

  myLists: {
    greeting: (name: string) => `Привет, ${name}`,
    emptyTitle: 'Тут пока пусто',
    emptyText: 'Создай первый вишлист — на день рождения, Новый год или просто так. А потом поделись ссылкой с друзьями',
    createFirst: 'Создать первый вишлист',
  },

  profile: {
    title: 'Профиль',
    stats: {
      lists: ['вишлист', 'вишлиста', 'вишлистов'] as PluralForms,
      wishes: ['желание', 'желания', 'желаний'] as PluralForms,
      received: ['получено', 'получено', 'получено'] as PluralForms,
    },
    copyLink: 'Скопировать ссылку',
    linkCopied: 'Ссылка скопирована',
    copyFailed: 'Не получилось скопировать',
    signOut: 'Выйти из аккаунта',
    personal: 'Личные данные',
    settingsTitle: 'Уведомления и приватность',
    settings: {
      bookings: { title: 'Показывать счётчик броней', hint: 'Только сколько, без имён и подарков' },
      friends: { title: 'Праздники подруг', hint: 'Напоминания за неделю' },
      mail: { title: 'Письма о новых бронях', hint: 'Без спойлеров, что именно' },
      visibility: { title: 'Кто видит мой профиль', hint: 'Все по ссылке' },
    },
    save: 'Сохранить изменения',
    saved: 'Сохранено',
  },

  header: {
    email: 'Почта',
    admin: 'Админка',
    myList: 'Мой список',
  },

  board: {
    ownTitle: 'Ваш список подарков',
    title: 'Список подарков',
    ownEmpty: 'Пока пусто. Добавьте первый подарок',
    empty: 'У этого человека пока нет подарков',
  },

  admin: {
    title: 'Админка',
    lead: 'Поиск по почте и одноразовые ссылки для сброса пароля',
  },

  notFound: {
    title: 'Такой страницы нет',
    text: 'Похоже, подарок спрятали слишком хорошо',
  },
};
