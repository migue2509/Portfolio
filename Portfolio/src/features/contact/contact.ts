const initialized = new WeakSet<HTMLElement>();

export function initializeContact() {
  const section = document.querySelector<HTMLElement>("#contacto");
  if (!section || initialized.has(section)) return;
  const form = section.querySelector<HTMLFormElement>("[data-contact-form]");
  const status = section.querySelector<HTMLElement>("[data-contact-status]");
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !status || !submit) return;
  initialized.add(section);
  const events = new AbortController();
  const endpoint = form.getAttribute("action") ?? "";
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+\/?$/.test(endpoint);
  let sending = false;
  let request: AbortController | undefined;

  function feedback(message: string, state: "sending" | "success" | "error") {
    status!.textContent = message;
    status!.dataset.state = state;
  }

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity("");
      if (!sending) {
        status.textContent = "";
        delete status.dataset.state;
      }
    }
  }, { signal: events.signal });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!configured) {
      feedback("El formulario no está disponible todavía. Puedes escribirme por correo.", "error");
      return;
    }
    const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    fields.forEach((field) => {
      field.setCustomValidity(field.value.trim() ? "" : "Completa este campo.");
    });
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      if (typeof value === "string") data.set(key, value.trim());
    }

    sending = true;
    submit.disabled = true;
    submit.textContent = "Enviando…";
    fields.forEach((field) => { field.disabled = true; });
    form.setAttribute("aria-busy", "true");
    feedback("Enviando tu mensaje…", "sending");
    request = new AbortController();
    const timeout = window.setTimeout(() => request?.abort(), 20000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: request.signal,
      });
      if (events.signal.aborted) return;
      if (!response.ok) {
        feedback(response.status === 429
          ? "Hay demasiados intentos. Espera unos minutos o escríbeme por correo."
          : "No se pudo enviar el mensaje. Revisa los datos e inténtalo de nuevo, o escríbeme por correo.", "error");
        return;
      }
      form.reset();
      feedback("¡Mensaje enviado! Gracias por escribirme.", "success");
    } catch {
      if (!events.signal.aborted) {
        feedback("No pudimos confirmar el envío. Revisa tu conexión e inténtalo de nuevo, o escríbeme por correo.", "error");
      }
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      request = undefined;
      fields.forEach((field) => { field.disabled = false; });
      submit.disabled = !configured;
      submit.textContent = "Enviar";
      form.removeAttribute("aria-busy");
    }
  }, { signal: events.signal });


  document.addEventListener("astro:before-swap", () => {
    events.abort();
    request?.abort();
    initialized.delete(section);
  }, { once: true, signal: events.signal });
}
