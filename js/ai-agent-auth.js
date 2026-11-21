/* Real Supabase authentication; course content remains available to guests. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const dialog = $('#authDialog');
  if (!dialog) return;
  const form = $('#authForm'), submit = $('#authSubmit');
  const email = $('#authEmail'), password = $('#authPassword'), confirm = $('#authConfirm');
  const allowEmail = window.AgentLessonAuthConfig?.emailPassword !== false;
  const allowGoogle = window.AgentLessonAuthConfig?.google === true;
  const labels = {
    signin: ['ھېساباتقا كىرىش', 'ئېلېكترونلۇق خەت ئادرېسى ۋە پارولىڭىزنى كىرگۈزۈڭ.', 'ھېساباتقا كىرىش'],
    signup: ['يېڭى ھېسابات قۇرۇش', 'تىزىملىتىڭ، ئاندىن كەلگەن خەت ئارقىلىق ئادرېسىڭىزنى جەزملەشتۈرۈڭ.', 'ھېسابات قۇرۇش'],
    reset: ['پارولنى ئەسلىگە كەلتۈرۈش', 'پارولنى يېڭىلاش ئۇلانمىسىنى ئېلىش ئۈچۈن ئادرېسىڭىزنى كىرگۈزۈڭ.', 'ئۇلانما ئەۋەتىش'],
    update: ['يېڭى پارول بەلگىلەش', 'يېڭى پارولىڭىزنى ئىككى قېتىم كىرگۈزۈڭ.', 'يېڭى پارولنى ساقلاش'],
    account: ['ھېساباتىم', 'ھېساباتىڭىزغا كىردىڭىز.', '']
  };
  let client = null, mode = 'signin', busy = false, user = null, opener = null, readiness = '';
  let recovering = false, revision = 0;
  const api = window.AgentLessonAuth = { currentUser: null, configured: false, ready: Promise.resolve(), open };
  function publicConfiguration(config) {
    try {
      const url = new URL(config?.url || '');
      if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)) return null;
      const key = String(config.publishableKey || '').trim();
      if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
        const parts = key.split('.');
        if (parts.length !== 3 || JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))).role !== 'anon') return null;
      }
      return {url: url.origin, key};
    } catch { return null; }
  }
  function message(text = '', kind = '') {
    $('#authMessage').textContent = text;
    $('#authMessage').dataset.kind = kind;
  }
  function clearPasswords() {
    password.value = ''; confirm.value = ''; password.type = 'password';
    confirm.setCustomValidity('');
    $('#authShowPassword').textContent = 'كۆرسىتىش';
    $('#authShowPassword').setAttribute('aria-pressed', 'false');
    $('#authShowPassword').setAttribute('aria-label', 'پارولنى كۆرسىتىش');
  }
  function enabled() {
    form.setAttribute('aria-busy', String(busy));
    form.querySelectorAll('input,button').forEach(el => { el.disabled = busy || !api.configured; });
    $('#authSignout').disabled = busy; $('#authChangePassword').disabled = busy;
    $('#authGoogle').disabled = busy || !api.configured;
    $('#authGoogle').setAttribute('aria-busy', String(busy));
    submit.textContent = busy ? 'بىر ئاز كۈتۈڭ…' : labels[mode][2];
    $('#authUnavailable').hidden = !readiness;
    $('#authUnavailable').textContent = readiness;
  }
  function view(next, {preserveMessage = false} = {}) {
    if (!allowEmail && ['signup', 'reset', 'update'].includes(next)) next = 'signin';
    if (next === 'account' && !user) next = 'signin';
    if (next === 'update' && !user && !recovering) next = 'signin';
    mode = next;
    clearPasswords();
    $('#authTitle').textContent = labels[mode][0];
    $('#authDescription').textContent = mode === 'signin' && !allowEmail ? 'Google ھېساباتىڭىز ئارقىلىق دەرس ھېساباتىڭىزغا كىرىڭ.' : labels[mode][1];
    const signingUp = mode === 'signup', changing = mode === 'update';
    const hasPassword = mode === 'signin' || signingUp || changing;
    $('.auth-tabs').hidden = !allowEmail || !['signin', 'signup'].includes(mode);
    $('#authGoogleSection').hidden = !allowGoogle || !['signin', 'signup'].includes(mode);
    $('#authSigninTab').setAttribute('aria-pressed', String(mode === 'signin'));
    $('#authSignupTab').setAttribute('aria-pressed', String(signingUp));
    $('#authNameField').hidden = !signingUp; $('#authName').disabled = !signingUp;
    $('#authEmailField').hidden = changing; email.required = !changing;
    $('#authPasswordField').hidden = !hasPassword; password.required = hasPassword;
    password.minLength = signingUp || changing ? 8 : 1;
    password.autocomplete = mode === 'signin' ? 'current-password' : 'new-password';
    $('#authPasswordHint').hidden = !signingUp && !changing;
    $('#authConfirmField').hidden = !signingUp && !changing;
    confirm.required = signingUp || changing;
    form.hidden = !allowEmail || mode === 'account'; $('#authAccount').hidden = mode !== 'account';
    $('#authChangePassword').hidden = !allowEmail;
    $('#authForgotPassword').hidden = !allowEmail || mode !== 'signin';
    $('#authBackToSignin').hidden = mode !== 'reset' && mode !== 'update';
    $('#authAccountEmail').textContent = user?.email || '';
    if (!preserveMessage) message();
    enabled();
    // Hidden fields must not participate in browser constraint validation.
    $('#authName').disabled ||= !signingUp;
    email.disabled ||= changing;
    password.disabled ||= !hasPassword;
    confirm.disabled ||= !signingUp && !changing;
  }
  function open(next = user ? 'account' : 'signin') {
    opener = document.activeElement;
    view(next);
    if (!dialog.open) dialog.showModal();
    const first = allowGoogle && ['signin', 'signup'].includes(mode) ? $('#authGoogle') : [...form.querySelectorAll('input')].find(el => !el.disabled && !el.closest('[hidden]'));
    (first || $('#closeAuth')).focus();
  }
  function updateUser(next) {
    const safe = next?.id ? {id: String(next.id), email: String(next.email || '')} : null;
    const changed = safe?.id !== user?.id;
    user = safe; api.currentUser = safe;
    $('#accountButton').textContent = user ? 'ھېساباتىم' : allowGoogle && !allowEmail ? 'ھېساباتقا كىرىش' : 'كىرىش / تىزىملىتىش';
    $('#authAccountEmail').textContent = user?.email || '';
    if (changed) {
      window.dispatchEvent(new CustomEvent('agent-auth-changed', {detail: {user: safe}}));
      $('#authAnnouncement').textContent = user ? 'ھېساباتقا كىردىڭىز.' : 'ھېساباتتىن چىقتىڭىز.';
    }
  }
  function errorText(error) {
    const code = error?.code || '';
    if (code === 'invalid_credentials') return 'ئېلېكترونلۇق خەت ئادرېسى ياكى پارول توغرا ئەمەس.';
    if (code === 'email_not_confirmed') return 'ئاۋۋال كەلگەن خەتتىكى ئۇلانما ئارقىلىق ئادرېسىڭىزنى جەزملەشتۈرۈڭ.';
    if (code === 'email_address_not_authorized' || code === 'unexpected_failure') return 'بۇ ئادرېسقا جەزملەشتۈرۈش خېتى ئەۋەتىلمىدى. دەرس باشقۇرغۇچىسى بىلەن ئالاقىلىشىڭ.';
    if (['weak_password', 'same_password'].includes(code)) return 'باشقىچە، تېخىمۇ كۈچلۈك پارول تاللاڭ.';
    if (code === 'signup_disabled') return 'ھازىر يېڭى ھېسابات قۇرۇش ۋاقتىنچە توختىتىلغان.';
    if (['email_address_invalid', 'validation_failed'].includes(code)) return 'ئادرېس ۋە پارولنى تەكشۈرۈپ، قايتا سىناڭ.';
    if (error?.status === 429 || code.includes('rate_limit')) return 'تەلەپ بەك كۆپ بولدى. بىر ئاز كۈتۈپ، قايتا سىناڭ.';
    if (['flow_state_expired', 'flow_state_not_found', 'bad_code_verifier', 'otp_expired'].includes(code)) return 'ئۇلانمىنىڭ ۋاقتى ئۆتۈپ كەتكەن ياكى ئۇ باشقا توركۆرگۈچتە ئېچىلغان. يېڭى ئۇلانما تەلەپ قىلىڭ.';
    if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError) return 'ھېسابات مۇلازىمىتىگە ئۇلىنالمىدى. تور ئۇلىنىشىنى تەكشۈرۈپ، قايتا سىناڭ.';
    return 'مەشغۇلات تاماملانمىدى. ئۇچۇرلىرىڭىزنى تەكشۈرۈپ، قايتا سىناڭ.';
  }
  const returnUrl = () => location.origin + location.pathname;
  $('#authGoogle').addEventListener('click', async () => {
    if (busy || !api.configured || !allowGoogle) return;
    busy = true; enabled(); message('Google غا ئۇلىنىۋاتىدۇ…');
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 10000);
    try {
      // Verify readiness so a disabled provider never lands the learner on an API error page.
      const response = await fetch(config.url + '/auth/v1/settings', {headers: {apikey:config.key}, signal:controller.signal});
      if (!response.ok) throw new Error('Provider unavailable');
      const settings = await response.json();
      if (settings.external?.google !== true) {
        message('Google ئارقىلىق كىرىش تېخى تەييار بولمىدى. ھازىرچە دەرسنى مېھمان سۈپىتىدە ئۆگىنەلەيسىز.', 'error');
        return;
      }
      const {data, error} = await client.auth.signInWithOAuth({provider:'google', options:{redirectTo:returnUrl(), scopes:'openid email profile', queryParams:{prompt:'select_account'}, skipBrowserRedirect:true}});
      if (error) throw error;
      const target = new URL(data.url);
      if (target.origin !== config.url || target.pathname !== '/auth/v1/authorize' || target.searchParams.get('provider') !== 'google' || target.searchParams.get('redirect_to') !== returnUrl()) throw new Error('Invalid authorization destination');
      clearPasswords();
      location.assign(target.href);
    } catch (error) {
      message(error?.name === 'AbortError' ? 'ئۇلىنىش ۋاقتى توشتى. تور ئۇلىنىشىنى تەكشۈرۈپ، قايتا سىناڭ.' : errorText(error), 'error');
    } finally {clearTimeout(deadline); busy = false; enabled();}
  });
  $('#accountButton').addEventListener('click', () => open());
  $('#authSigninTab').addEventListener('click', () => view('signin'));
  $('#authSignupTab').addEventListener('click', () => view('signup'));
  $('#authForgotPassword').addEventListener('click', () => view('reset'));
  $('#authBackToSignin').addEventListener('click', () => view(user ? 'account' : 'signin'));
  $('#authChangePassword').addEventListener('click', () => view('update'));
  $('#closeAuth').addEventListener('click', () => dialog.close());
  $('#authContinueGuest').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {clearPasswords(); opener?.focus?.();});
  $('#authShowPassword').addEventListener('click', () => {
    const reveal = password.type === 'password'; password.type = reveal ? 'text' : 'password';
    $('#authShowPassword').setAttribute('aria-pressed', String(reveal));
    $('#authShowPassword').setAttribute('aria-label', reveal ? 'پارولنى يوشۇرۇش' : 'پارولنى كۆرسىتىش');
    $('#authShowPassword').textContent = reveal ? 'يوشۇرۇش' : 'كۆرسىتىش';
  });
  confirm.addEventListener('input', () => confirm.setCustomValidity(''));
  password.addEventListener('input', () => confirm.setCustomValidity(''));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !api.configured || !allowEmail) return;
    if (['signup', 'update'].includes(mode) && password.value !== confirm.value) {
      confirm.setCustomValidity('ئىككى قېتىم كىرگۈزۈلگەن پارول ئوخشاش بولۇشى كېرەك.');
      confirm.reportValidity(); return;
    }
    if (!form.reportValidity()) return;
    const operation = mode, address = email.value.trim(), secret = password.value;
    busy = true; message(); enabled();
    try {
      if (operation === 'signup') {
        const {data, error} = await client.auth.signUp({email: address, password: secret, options: {emailRedirectTo: returnUrl(), data: {display_name: $('#authName').value.trim()}}});
        if (error) throw error;
        if (data.session) {updateUser(data.user); view('account'); message('ھېساباتىڭىز قۇرۇلدى؛ ھازىر كىردىڭىز.', 'success');}
        else {view('signin'); message('تىزىملىتىش تەلىپىڭىز قوبۇل قىلىندى. كەلگەن خەتتىكى ئۇلانمىنى مۇشۇ توركۆرگۈچتە ئېچىپ، ئادرېسىڭىزنى جەزملەشتۈرۈڭ؛ ئاندىن ھېساباتىڭىزغا كىرىڭ.', 'success');}
      } else if (operation === 'signin') {
        const {data, error} = await client.auth.signInWithPassword({email: address, password: secret});
        if (error) throw error;
        if (!data.session || !data.user) throw new Error('No session');
        updateUser(data.user); view('account'); message('ھېساباتىڭىزغا كىردىڭىز.', 'success');
      } else if (operation === 'reset') {
        const {error} = await client.auth.resetPasswordForEmail(address, {redirectTo: returnUrl()});
        if (error) throw error;
        message('ئەگەر بۇ ئادرېسقا ھېسابات تىزىملاتقان بولسىڭىز، پارولنى يېڭىلاش ئۇلانمىسى كېلىدۇ. ئۇنى مۇشۇ توركۆرگۈچتە ئېچىڭ.', 'success');
      } else if (operation === 'update') {
        const {error} = await client.auth.updateUser({password: secret});
        if (error) throw error;
        recovering = false; view('account'); message('پارولىڭىز يېڭىلاندى.', 'success');
      }
      clearPasswords();
    } catch (error) {message(errorText(error), 'error'); clearPasswords();}
    finally {busy = false; view(mode, {preserveMessage:true});}
  });
  $('#authSignout').addEventListener('click', async () => {
    if (busy || !client) return;
    busy = true; enabled(); message();
    try {
      const {error} = await client.auth.signOut({scope: 'local'});
      if (error) throw error;
      recovering = false; updateUser(null); view('signin'); message('بۇ ئۈسكۈنىدىكى ھېساباتىڭىزدىن چىقتىڭىز.', 'success');
    } catch (error) {message(errorText(error), 'error');}
    finally {busy = false; view(mode, {preserveMessage:true});}
  });
  const config = publicConfiguration(window.AgentLessonAuthConfig);
  const servedSecurely = location.protocol === 'https:' || location.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if (!config) readiness = 'ھېسابات مۇلازىمىتى تېخى ئۇلانمىدى. ھازىرچە مېھمان سۈپىتىدە دەرس ئۆگىنەلەيسىز.';
  else if (!servedSecurely) readiness = 'ھېساباتقا كىرىش ئۈچۈن دەرسنىڭ تور ئادرېسىنى ئېچىڭ. بۇ يەرلىك نۇسخىدا دەرسلەرنى داۋاملىق ئۆگىنەلەيسىز.';
  else if (!window.AgentSupabaseSDK) readiness = 'ھېسابات قورالى يۈكلەنمىدى. بەتنى يېڭىلاپ، قايتا سىناڭ.';
  else {
    try {
      // PKCE must survive opening an email link in another tab of this browser.
      const memory = new Map();
      const storage = {
        getItem(key) {try {return localStorage.getItem(key);} catch {return memory.get(key) ?? null;}},
        setItem(key, value) {try {localStorage.setItem(key, value);} catch {memory.set(key, value);}},
        removeItem(key) {try {localStorage.removeItem(key);} catch {} memory.delete(key);}
      };
      client = window.AgentSupabaseSDK.createClient(config.url, config.key, {auth: {flowType:'pkce', detectSessionInUrl:true, persistSession:true, autoRefreshToken:true, storage, storageKey:'agent-lab-supabase-auth-v1'}});
      api.configured = true;
      client.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') recovering = true;
        const request = ++revision;
        // Keep SDK callbacks synchronous; async SDK calls here can lock auth state.
        setTimeout(async () => {
          if (request !== revision) return;
          if (event === 'SIGNED_OUT') {updateUser(null); if (dialog.open) view('signin', {preserveMessage:mode === 'signin'}); return;}
          if (!session) {updateUser(null); return;}
          try {
            const {data, error} = await client.auth.getUser();
            if (request !== revision) return;
            if (error) throw error;
            updateUser(data.user);
            if (recovering) {if (!dialog.open || mode !== 'update') open('update');}
            else if (dialog.open && mode !== 'update' && !busy) view('account', {preserveMessage:mode === 'account'});
          } catch (error) {if (request === revision) {if (error?.status === 401 || error?.status === 403) updateUser(null); if (dialog.open) message(errorText(error), 'error');}}
        }, 0);
      });
      const restore = client.auth.getSession().then(({data, error}) => {
        if (error) {open('signin'); message(errorText(error), 'error');}
        else updateUser(data.session?.user || null);
      }).catch(() => {readiness = 'ھېسابات مۇلازىمىتىگە ئۇلىنالمىدى. دەرسنى داۋاملىق ئۆگىنەلەيسىز.'; enabled();});
      // Select the correct local progress scope before the shell records a read.
      // Offline visitors must still reach the lesson if a refresh cannot finish.
      api.ready = Promise.race([restore, new Promise(resolve => setTimeout(resolve, 3000))]);
    } catch {readiness = 'ھېسابات مۇلازىمىتى قوزغالمىدى. دەرسنى داۋاملىق ئۆگىنەلەيسىز.'; api.configured = false;}
  }
  view('signin'); updateUser(null);
})();
