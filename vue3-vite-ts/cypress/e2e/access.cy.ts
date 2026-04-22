describe("Input Validation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should handle special characters in username", () => {
    cy.get('[name="username"]').type("user@email.com");
    cy.get('[name="username"]').should("have.value", "user@email.com");
  });

  it("Should handle spaces in username", () => {
    cy.get('[name="username"]').type("john doe");
    cy.get('[name="username"]').should("have.value", "john doe");
  });

  it("Should handle long password input", () => {
    const longPassword = "verylongpasswordwith123456789andspecialchars!@#$%";
    cy.get('[name="password"]').type(longPassword);
    cy.get('[name="password"]').should("have.value", longPassword);
  });

  it("Should maintain focus on input fields", () => {
    cy.get('[name="username"]').click().should("have.focus");
    cy.get('[name="password"]').click().should("have.focus");
  });

  it("Should allow rapid successive clicks on submit button", () => {
    cy.get('[name="username"]').type("rapidtest");
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome rapidtest!");
  });

  it("Should handle numeric-only username", () => {
    cy.get('[name="username"]').type("12345");
    cy.get('[name="password"]').type("password123");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome 12345!");
  });

  // it("Should fail - test form elements count (intentional failure)", () => {
  // This will fail if the form doesn't have exactly 2 input fields + 1 submit button
  // cy.get("form").find("input").should("have.length", 5);
  // });
});

describe("UI Responsiveness", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should display form elements correctly on load", () => {
    cy.get("form").should("be.visible");
    cy.get('[name="username"]').should("be.visible");
    cy.get('[name="password"]').should("be.visible");
    cy.get('[type="submit"]').should("be.visible");
  });

  it("Should handle window resize", () => {
    cy.viewport(320, 568); // Mobile size
    cy.get("form").should("be.visible");
    cy.viewport(1920, 1080); // Desktop size
    cy.get("form").should("be.visible");
  });

  it("Should maintain form state during resize", () => {
    cy.get('[name="username"]').type("testuser");
    cy.viewport(320, 568);
    cy.get('[name="username"]').should("have.value", "testuser");
    cy.viewport(1920, 1080);
    cy.get('[name="username"]').should("have.value", "testuser");
  });

  it("Should handle rapid viewport changes", () => {
    for (let i = 0; i < 5; i++) {
      cy.viewport(320 + i * 100, 568 + i * 50);
      cy.get("form").should("be.visible");
    }
  });

  it("Should work with different device orientations", () => {
    cy.viewport("iphone-6", "portrait");
    cy.get("form").should("be.visible");
    cy.viewport("iphone-6", "landscape");
    cy.get("form").should("be.visible");
  });

  it("FLAKY - Should handle random viewport sizes", () => {
    const randomWidth = Math.floor(Math.random() * 1000) + 320;
    const randomHeight = Math.floor(Math.random() * 500) + 568;
    cy.viewport(randomWidth, randomHeight);
    cy.get("form").should("be.visible");
  });

  it("FLAKY - Should work with extreme viewport sizes", () => {
    const sizes = [
      [1920, 1080],
      [2560, 1440],
      [3840, 2160],
      [320, 568],
      [375, 667],
    ];
    const randomIndex = Math.floor(Math.random() * sizes.length);
    cy.viewport(sizes[randomIndex][0], sizes[randomIndex][1]);
    cy.get("form").should("be.visible");
  });
});

describe("Error Handling", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should handle invalid username format", () => {
    cy.get('[name="username"]').type("invalid@#$%");
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome invalid@#$%!");
  });

  it("Should handle empty password", () => {
    cy.get('[name="username"]').type("emptypass");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("not.exist");
  });

  it("Should handle extremely long inputs", () => {
    const veryLongString = "a".repeat(100);
    cy.get('[name="username"]').type(veryLongString);
    cy.get('[name="username"]').should("have.value", veryLongString);
  });

  it("Should handle special Unicode characters", () => {
    cy.get('[name="username"]').type("用户名");
    cy.get('[name="password"]').type("密码");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome 用户名!");
  });

  it("FLAKY - Should handle random error conditions", () => {
    const errors = ["network", "timeout", "validation", "server"];
    const randomError = errors[Math.floor(Math.random() * errors.length)];

    cy.get('[name="username"]').type(`error${randomError}`);
    cy.get('[name="password"]').type("password");

    if (Math.random() > 0.5) {
      cy.intercept("POST", "**", { statusCode: 500 });
    }

    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", `Welcome error${randomError}!`);
  });

  it("FLAKY - Should handle intermittent failures", () => {
    let attemptCount = 0;
    cy.intercept("POST", "**", (req) => {
      attemptCount++;
      if (attemptCount % 3 === 0) {
        req.reply({ statusCode: 500 });
      } else {
        req.reply({ statusCode: 200 });
      }
    });

    cy.get('[name="username"]').type("intermittent");
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome intermittent!");
  });
});

describe("Accessibility Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should have proper ARIA labels", () => {
    cy.get('[name="username"]').should("have.attr", "aria-label");
    cy.get('[name="password"]').should("have.attr", "aria-label");
  });

  it("Should have proper form structure", () => {
    cy.get("form").should("have.attr", "role", "form");
    cy.get('[type="submit"]').should("have.attr", "aria-label");
  });

  it("FLAKY - Should handle screen reader announcements", () => {
    cy.get('[name="username"]').type("screenreader");
    cy.get('[name="password"]').type("password");

    // Simulate screen reader delay
    const randomDelay = Math.floor(Math.random() * 1000) + 200;
    cy.wait(randomDelay);

    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome screenreader!");
  });

  it("FLAKY - Should maintain focus management", () => {
    cy.get('[name="username"]').focus();

    if (Math.random() > 0.5) {
      cy.get('[name="password"]').focus();
    }

    cy.get('[type="submit"]').click();

    // Focus should move to success message
    cy.get("h1").should("have.focus");
  });
});

describe("Cross-browser Compatibility", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should work with different input methods", () => {
    // Simulate paste
    cy.get('[name="username"]').invoke("val", "pasteduser").trigger("input");
    cy.get('[name="username"]').should("have.value", "pasteduser");
  });

  it("Should handle drag and drop", () => {
    // This would normally test file uploads, but we'll simulate text drag
    cy.get('[name="username"]').type("draguser");
    cy.get('[name="username"]').should("have.value", "draguser");
  });

  it("Should handle context menu", () => {
    cy.get('[name="username"]').rightclick();
    cy.get('[name="username"]').should("be.visible");
  });

  it("FLAKY - Should handle browser-specific behaviors", () => {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    ];

    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, "userAgent", { value: randomUA });
    });

    cy.get('[name="username"]').type("browseruser");
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome browseruser!");
  });

  it("FLAKY - Should handle random browser events", () => {
    const events = ["focus", "blur", "input", "change"];
    const randomEvent = events[Math.floor(Math.random() * events.length)];

    cy.get('[name="username"]').type("eventuser");
    cy.get('[name="username"]').trigger(randomEvent);

    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", "Welcome eventuser!");
  });
});

describe("Security Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("Should prevent XSS in username field", () => {
    const xssPayload = "<script>alert('xss')</script>";
    cy.get('[name="username"]').type(xssPayload);
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", `Welcome ${xssPayload}!`);
  });

  it("Should prevent SQL injection in username", () => {
    const sqlPayload = "'; DROP TABLE users; --";
    cy.get('[name="username"]').type(sqlPayload);
    cy.get('[name="password"]').type("password");
    cy.get('[type="submit"]').click();
    cy.get("h1").should("have.text", `Welcome ${sqlPayload}!`);
  });

  it("Should handle password masking", () => {
    cy.get('[name="password"]').type("secret123");
    cy.get('[name="password"]').should("have.attr", "type", "password");
  });

  it("Should prevent autocomplete on sensitive fields", () => {
    cy.get('[name="password"]').should("have.attr", "autocomplete", "off");
  });

  it("FLAKY - Should handle timing attacks simulation", () => {
    const usernames = ["admin", "user", "guest", "root", "administrator"];

    usernames.forEach((username) => {
      const startTime = Date.now();
      cy.get('[name="username"]').clear().type(username);
      cy.get('[name="password"]').clear().type("wrongpassword");
      cy.get('[type="submit"]').click();
      const endTime = Date.now();

      // Simulate timing attack detection - this will be flaky
      const responseTime = endTime - startTime;
      expect(responseTime).to.be.lessThan(2000 + Math.random() * 1000);
    });
  });
});
