const helloWorldCreator = (name) => {
  return () => {
    const message = `Hello from ${name}`;
    console.log(message);
    alert(message);
  };
};

export default (keyCode, key, name) => {
  return {
    init () {
      Reveal.addKeyBinding({ keyCode, key, description: 'Tell me hello!' }, helloWorldCreator(name));
    }
  };
};
