const Storage_keys = {
  theme: "Theme",
  font: "Font",
  color: "Color",
};

const Default_font = "Font_tajawal";
const Default_color_index = 0;
const Nav_scroll_offset = 100;
const Top_button_scroll_threshold = 300;
const Success_modal_timeout = 5000;
const Slide_breakpoint_mobile = 640;
const Slide_breakpoint_tablet = 1024;

const Email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const Phone_pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

const Colors = [
  { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
  { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", accent: "#fb923c" },
  { name: "Green Emerald", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
  { name: "Blue Cyan", primary: "#3b82f7", secondary: "#06b6d4", accent: "#22d3ee" },
  { name: "Red Rose", primary: "#ef4444", secondary: "#f43f4e", accent: "#fb7185" },
  { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c", accent: "#fbbf24" }
];

const Theme_button = document.getElementById("Theme_button");
const Nav_menu = document.getElementById("Nav_menu");
const Nav_links = document.querySelectorAll(".Nav_link");
const Filter_buttons = document.querySelectorAll(".Filter_button");
const Portfolio_items = document.querySelectorAll(".Portfolio_item");
const Top_button = document.getElementById("Top_button");
const Settings_button = document.getElementById("Settings_button");
const Settings_panel = document.getElementById("Settings_panel");
const Font_options = document.querySelectorAll(".Font_option");
const Colors_list = document.getElementById("Colors_list");
const Reset_button = document.getElementById("Reset_button");
const Contact_form = document.getElementById("Contact_form");
const Slider_track = document.getElementById("Slider_track");
const Slider_slides = document.querySelectorAll(".Slider_slide");
const Slider_prev = document.getElementById("Slider_prev");
const Slider_next = document.getElementById("Slider_next");
const Slider_dots = document.getElementById("Slider_dots");
const Form_selects = document.getElementsByClassName("form-select");
const Form_inputs = document.querySelectorAll(".Form_input");

let Slider_index = 0;
let Slider_count = 3;


function Load_theme() {
  let Saved_theme = localStorage.getItem(Storage_keys.theme);

  if (Saved_theme == "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
}

function Change_theme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem(Storage_keys.theme, "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem(Storage_keys.theme, "dark");
  }
}

Theme_button.addEventListener("click", Change_theme);

Load_theme();


function Close_menu() {
  Nav_menu.classList.remove("show");
}

Nav_links.forEach(function (Link) {
  Link.addEventListener("click", Close_menu);
});


function Show_item(Item) {
  Item.classList.remove("d-none");
  Item.style.opacity = "1";
  Item.style.transform = "scale(1)";
}

function Hide_item(Item) {
  Item.style.opacity = "0";
  Item.style.transform = "scale(0.8)";

  Item.addEventListener("transitionend", function On_transition_end(Event) {
    if (Event.propertyName !== "opacity" || Event.target !== Item) {
      return;
    }

    Item.removeEventListener("transitionend", On_transition_end);

    if (Item.style.opacity === "0") {
      Item.classList.add("d-none");
    }
  });
}

function Filter_projects(Chosen_filter, Button) {
  Filter_buttons.forEach(function (Filter_button) {
    Filter_button.classList.remove("active");
  });

  Button.classList.add("active");

  Portfolio_items.forEach(function (Item) {
    const Item_category = Item.getAttribute("data-category");
    const Is_hidden = Item.classList.contains("d-none");
    const Matches_filter = Chosen_filter === "all" || Chosen_filter === Item_category;

    if (Matches_filter) {
      if (Is_hidden) {
        Show_item(Item);
      }
    } else {
      Hide_item(Item);
    }
  });
}

Filter_buttons.forEach(function (Button) {
  Button.addEventListener("click", function () {
    Filter_projects(Button.getAttribute("data-filter"), Button);
  });
});


function Mark_nav() {
  let Current_link = Nav_links[0];

  Nav_links.forEach(function (Link) {
    const Section_id = Link.getAttribute("href").substring(1);
    const Section = document.getElementById(Section_id);

    if (Section && window.scrollY >= Section.offsetTop - Nav_scroll_offset) {
      Current_link = Link;
    }
  });

  Nav_links.forEach(function (Link) {
    Link.classList.remove("active");
  });

  if (Current_link) {
    Current_link.classList.add("active");
  }
}

window.addEventListener("scroll", Mark_nav);

Mark_nav();


function Check_scroll() {
  const Is_visible = window.scrollY > Top_button_scroll_threshold;

  Top_button.classList.toggle("Show_button", Is_visible);
}

function Go_top() {
  window.scrollTo(0, 0);
}

window.addEventListener("scroll", Check_scroll);
Top_button.addEventListener("click", Go_top);

Check_scroll();


function Get_slider_count() {
  if (window.innerWidth < Slide_breakpoint_mobile) {
    return 1;
  } else if (window.innerWidth < Slide_breakpoint_tablet) {
    return 2;
  } else {
    return 3;
  }
}

function Move_slider() {
  const Move_percent = Slider_index * (100 / Slider_count);
  const Dots = Slider_dots.children;

  Slider_track.style.transform = `translateX(${Move_percent}%)`;

  Array.from(Dots).forEach(function (Dot, Index) {
    Dot.classList.toggle("Dot_active", Index === Slider_index);
  });
}

function Go_slide(Slide_number) {
  Slider_index = Slide_number;
  Move_slider();
}

function Show_slider_dots() {
  const Dots_total = Slider_slides.length - Slider_count + 1;

  Slider_dots.innerHTML = "";

  for (let i = 0; i < Dots_total; i++) {
    const Dot = document.createElement("button");

    Dot.type = "button";
    Dot.className = "Dot_button";
    Dot.setAttribute("aria-label", "Slide " + (i + 1));
    Dot.setAttribute("onclick", "Go_slide(" + i + ")");
    Slider_dots.appendChild(Dot);
  }
}

function Next_slide() {
  const Last_index = Slider_slides.length - Slider_count;

  if (Slider_index >= Last_index) {
    Slider_index = 0;
  } else {
    Slider_index = Slider_index + 1;
  }

  Move_slider();
}

function Prev_slide() {
  const Last_index = Slider_slides.length - Slider_count;

  if (Slider_index <= 0) {
    Slider_index = Last_index;
  } else {
    Slider_index = Slider_index - 1;
  }

  Move_slider();
}

function Reset_slider() {
  Slider_count = Get_slider_count();
  Slider_index = 0;
  Show_slider_dots();
  Move_slider();
}

Slider_next.addEventListener("click", Next_slide);
Slider_prev.addEventListener("click", Prev_slide);
window.addEventListener("resize", Reset_slider);

Reset_slider();


Settings_panel.addEventListener("show.bs.offcanvas", function () {
  Settings_button.style.right = "320px";
});

Settings_panel.addEventListener("hide.bs.offcanvas", function () {
  Settings_button.style.right = "0";
});


function Choose_font(Font_name) {
  document.body.className = Font_name;

  Font_options.forEach(function (Option) {
    Option.classList.toggle("active", Option.getAttribute("data-font") === Font_name);
  });

  localStorage.setItem(Storage_keys.font, Font_name);
}

Font_options.forEach(function (Option) {
  Option.addEventListener("click", function () {
    Choose_font(Option.getAttribute("data-font"));
  });
});

function Load_font() {
  const Saved_font = localStorage.getItem(Storage_keys.font) || Default_font;

  Choose_font(Saved_font);
}

Load_font();


function Hex_to_rgb(Hex_color) {
  const Red = parseInt(Hex_color.slice(1, 3), 16);
  const Green = parseInt(Hex_color.slice(3, 5), 16);
  const Blue = parseInt(Hex_color.slice(5, 7), 16);

  return Red + ", " + Green + ", " + Blue;
}

function Show_colors() {
  let Color_buttons = "";

  for (let i = 0; i < Colors.length; i++) {
    Color_buttons += `
      <button type="button" class="Color_button" title="${Colors[i].name}" onclick="Choose_color(${i})"
        style="background-image: linear-gradient(135deg, ${Colors[i].primary}, ${Colors[i].secondary})"></button>
    `;
  }

  Colors_list.innerHTML = Color_buttons;
}

function Choose_color(Color_number) {
  const Color = Colors[Color_number];
  const Root = document.documentElement;
  const Color_buttons = document.querySelectorAll(".Color_button");

  Root.style.setProperty("--Primary_color", Color.primary);
  Root.style.setProperty("--Secondary_color", Color.secondary);
  Root.style.setProperty("--Accent_color", Color.accent);
  Root.style.setProperty("--Primary_rgb", Hex_to_rgb(Color.primary));
  Root.style.setProperty("--Secondary_rgb", Hex_to_rgb(Color.secondary));
  Root.style.setProperty("--Accent_rgb", Hex_to_rgb(Color.accent));

  Color_buttons.forEach(function (Button, Index) {
    Button.classList.toggle("Chosen_color", Index === Color_number);
  });

  localStorage.setItem(Storage_keys.color, Color_number);
}

function Load_color() {
  const Saved_color = localStorage.getItem(Storage_keys.color);

  if (Saved_color === null) {
    Choose_color(Default_color_index);
  } else {
    Choose_color(Number(Saved_color));
  }
}

Show_colors();
Load_color();


function Reset_settings() {
  localStorage.removeItem(Storage_keys.font);
  localStorage.removeItem(Storage_keys.color);

  Choose_font(Default_font);
  Choose_color(Default_color_index);
}

Reset_button.addEventListener("click", Reset_settings);


function Mark_field(Field, Is_good) {
  Field.classList.toggle("is-invalid", !Is_good);
}

function Check_form(event) {
  event.preventDefault();

  let Form_good = true;

  const Name_input = document.getElementById("Contact_name");
  const Email_input = document.getElementById("Contact_email");
  const Phone_input = document.getElementById("Contact_phone");
  const Type_input = document.getElementById("Contact_type");
  const Message_input = document.getElementById("Contact_message");
  const Email_error = document.getElementById("Email_error");
  const Message_error = document.getElementById("Message_error");

  if (Name_input.value.trim() === "") {
    Mark_field(Name_input, false);
    Form_good = false;
  } else {
    Mark_field(Name_input, true);
  }

  if (Email_input.value.trim() === "") {
    Email_error.innerHTML = "يرجى إدخال البريد الإلكتروني";
    Mark_field(Email_input, false);
    Form_good = false;
  } else if (Email_pattern.test(Email_input.value) === false) {
    Email_error.innerHTML = "يرجى إدخال بريد إلكتروني صحيح";
    Mark_field(Email_input, false);
    Form_good = false;
  } else {
    Mark_field(Email_input, true);
  }

  if (Phone_input.value.trim() !== "" && Phone_pattern.test(Phone_input.value.replace(/\s/g, "")) === false) {
    Mark_field(Phone_input, false);
    Form_good = false;
  } else {
    Mark_field(Phone_input, true);
  }

  if (Type_input.value === "") {
    Mark_field(Type_input, false);
    Form_good = false;
  } else {
    Mark_field(Type_input, true);
  }

  if (Message_input.value.trim() === "") {
    Message_error.innerHTML = "يرجى إدخال تفاصيل المشروع";
    Mark_field(Message_input, false);
    Form_good = false;
  } else if (Message_input.value.trim().length < 10) {
    Message_error.innerHTML = "يرجى إدخال المزيد من التفاصيل";
    Mark_field(Message_input, false);
    Form_good = false;
  } else {
    Mark_field(Message_input, true);
  }

  if (Form_good) {
    const Success_modal = new bootstrap.Modal(document.getElementById("Success_modal"));

    Success_modal.show();
    Contact_form.reset();

    Array.from(Form_selects).forEach(function (Select) {
      Select.classList.remove("Select_chosen");
    });
  }
}

Contact_form.addEventListener("submit", Check_form);

function Mark_select(Select) {
  Select.classList.toggle("Select_chosen", Select.value !== "");
}

Array.from(Form_selects).forEach(function (Select) {
  Select.addEventListener("change", function () {
    Mark_select(Select);
  });
});

Form_inputs.forEach(function (Input) {
  Input.addEventListener("input", function () {
    Input.classList.remove("is-invalid");
  });
});