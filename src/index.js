const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const articleRoutes = require("./routes/articleRoutes");
const Article = require("./models/Article");
const Doctor = require("./models/Doctor");
const appointmentRoutes = require("./routes/appointmentRoutes");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/")));
app.use(morgan("dev"));

// MongoDB connection
mongoose 
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
app.use("/uploads", express.static("uploads"));
app.use("/check", (req, res) => {
  res.send("Server is running");
});
// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/articles", articleRoutes);

const articles = [
  {
    author: "Dr. Sarah Lee",
    published_date: "2024-12-02T08:00:00.000Z",
    title: "Signs of a Healthy Pregnancy",
    author_image: "https://picsum.photos/200/101",
    article_cover: "https://picsum.photos/200/301",
    content:
      '## How to Know Your Pregnancy Is on Track\n\nA healthy pregnancy often shows these signs:\n\n- Regular fetal movements after 20 weeks.\n- Normal weight gain based on your trimester.\n- Consistent energy levels.\n\n### When to Contact Your Doctor\n\n- Severe abdominal pain.\n- Heavy bleeding.\n- Reduced fetal movement.\n\n> "Stay connected with your healthcare provider to ensure a smooth journey to motherhood." – Dr. Sarah Lee',
  },
  {
    author: "Dr. Mark Green",
    published_date: "2024-12-03T10:15:00.000Z",
    author_image: "https://picsum.photos/200/102",
    article_cover: "https://picsum.photos/200/302",
    title: "What to Expect During Your First Prenatal Visit",
    content:
      '## Preparing for Your First Prenatal Appointment\n\nYour first prenatal visit is an important milestone. Here\'s what to expect:\n\n- **Medical History**: Discussion of your health and family medical history.\n- **Physical Exam**: Includes weight, blood pressure, and pelvic exam.\n- **Lab Tests**: Blood work and urine tests to check for infections and conditions like anemia.\n\n> "The first visit sets the tone for a healthy pregnancy journey." – Dr. Mark Green',
  },
  {
    author: "Dr. Laura Bennett",
    published_date: "2024-12-04T11:30:00.000Z",
    author_image: "https://picsum.photos/200/103",
    article_cover: "https://picsum.photos/200/303",
    title: "The Role of Ultrasounds in Pregnancy",
    content:
      "## Understanding Prenatal Ultrasounds\n\nUltrasounds are a safe and effective way to monitor your baby's development. Key milestones include:\n\n- **First Trimester**: Confirm pregnancy and estimate due date.\n- **Second Trimester**: Check anatomy and gender.\n- **Third Trimester**: Monitor growth and position.\n\n> \"Ultrasounds provide a window into your baby's world.\" – Dr. Laura Bennett",
  },
  {
    author: "Dr. Anthony Miller",
    published_date: "2024-12-05T09:45:00.000Z",
    author_image: "https://picsum.photos/200/104",
    article_cover: "https://picsum.photos/200/304",
    title: "Debunking Myths About Vaccines",
    content:
      "## Separating Fact from Fiction\n\nThere are many myths about vaccines. Let's clarify:\n\n- **Myth**: Vaccines cause autism.\n  - **Fact**: Extensive research has shown no link between vaccines and autism.\n- **Myth**: Vaccines overload the immune system.\n  - **Fact**: The immune system handles far more antigens daily than what's in vaccines.\n\n> \"Trust science, not rumors.\" – Dr. Anthony Miller",
  },
  {
    author: "Dr. Grace Adams",
    published_date: "2024-12-06T14:00:00.000Z",
    author_image: "https://picsum.photos/200/105",
    article_cover: "https://picsum.photos/200/305",
    title: "Managing Morning Sickness",
    content:
      '## Tips for Coping with Nausea\n\nMorning sickness can be challenging, but these tips can help:\n\n- Eat small, frequent meals.\n- Avoid strong odors.\n- Stay hydrated with ginger tea or lemon water.\n\n> "Morning sickness is a sign of a healthy pregnancy. Embrace it with care." – Dr. Grace Adams',
  },
  {
    author: "Dr. Emily Carter",
    published_date: "2024-12-07T10:00:00.000Z",
    author_image: "https://picsum.photos/200/106",
    article_cover: "https://picsum.photos/200/306",
    title: "Vaccines for Newborns: What Parents Need to Know",
    content:
      '## Protecting Your Baby from Day One\n\nThe first vaccine, Hepatitis B, is given at birth. Benefits include:\n\n- Preventing liver infections.\n- Reducing the risk of chronic diseases.\n\n### Next Steps\n\n- Follow up with the pediatrician for the 2-month vaccination schedule.\n\n> "Early protection sets the stage for lifelong health." – Dr. Emily Carter',
  },
  {
    author: "Dr. Thomas White",
    published_date: "2024-12-08T13:00:00.000Z",
    author_image: "https://picsum.photos/200/107",
    article_cover: "https://picsum.photos/200/307",
    title: "Gestational Diabetes: Causes and Management",
    content:
      '## Understanding Gestational Diabetes\n\nGestational diabetes affects some pregnancies. Key factors include:\n\n- **Risk Factors**: Obesity, family history, and previous gestational diabetes.\n- **Management**: Balanced diet, regular exercise, and blood sugar monitoring.\n\n> "Managing gestational diabetes is crucial for a healthy baby." – Dr. Thomas White',
  },
  {
    author: "Dr. Rachel King",
    published_date: "2024-12-09T12:30:00.000Z",
    author_image: "https://picsum.photos/200/108",
    article_cover: "https://picsum.photos/200/308",
    title: "The Importance of the Flu Vaccine During Pregnancy",
    content:
      '## Protecting Yourself and Your Baby\n\nPregnant women are at higher risk for flu complications. The flu vaccine:\n\n- Protects the mother and baby for up to 6 months after birth.\n- Reduces the risk of severe illness.\n\n> "A simple shot can save lives." – Dr. Rachel King',
  },
  {
    author: "Dr. William Scott",
    published_date: "2024-12-10T11:00:00.000Z",
    author_image: "https://picsum.photos/200/109",
    article_cover: "https://picsum.photos/200/309",
    title: "The Role of Vitamin D in Pregnancy",
    content:
      '## Supporting Bone Health and Immunity\n\nVitamin D is essential for:\n\n- Fetal bone development.\n- Strengthening the mother\'s immune system.\n\n### Sources\n\n- Sunlight exposure.\n- Foods like fatty fish, eggs, and fortified milk.\n- Prenatal supplements.\n\n> "Vitamin D is a simple way to boost pregnancy health." – Dr. William Scott',
  },
  {
    author: "Dr. Olivia Brown",
    published_date: "2024-12-11T16:00:00.000Z",
    author_image: "https://picsum.photos/200/110",
    article_cover: "https://picsum.photos/200/310",
    title: "How to Prepare for a Pediatric Visit",
    content:
      '## Tips for Stress-Free Appointments\n\nPreparing for your child\'s doctor visit ensures a smooth experience:\n\n- Write down questions in advance.\n- Bring vaccination records.\n- Comfort your child with toys or snacks.\n\n> "Preparation makes all the difference." – Dr. Olivia Brown',
  },
  {
    author: "Dr. Ethan Cooper",
    published_date: "2024-12-12T08:30:00.000Z",
    author_image: "https://picsum.photos/200/111",
    article_cover: "https://picsum.photos/200/311",
    title: "Understanding the MMR Vaccine",
    content:
      '## Protecting Against Measles, Mumps, and Rubella\n\nThe MMR vaccine is given at 12-15 months and a booster at 4-6 years. Benefits include:\n\n- Preventing serious complications like pneumonia and encephalitis.\n- Reducing outbreaks in the community.\n\n> "Vaccination is a community effort." – Dr. Ethan Cooper',
  },
  {
    author: "Dr. Sophia Turner",
    published_date: "2024-12-13T14:45:00.000Z",
    author_image: "https://picsum.photos/200/112",
    article_cover: "https://picsum.photos/200/312",
    title: "Exercise During Pregnancy: What's Safe?",
    content:
      '## Staying Active While Expecting\n\nModerate exercise offers benefits like:\n\n- Improved mood and energy levels.\n- Reduced risk of gestational diabetes.\n- Easier labor and recovery.\n\n### Safe Options\n\n- Walking, swimming, and prenatal yoga.\n\n> "Listen to your body and stay active." – Dr. Sophia Turner',
  },
];
// Seed function
const seedDatabase = async () => {
  try {
    await Article.deleteMany(); // Clear existing data
    await Article.insertMany(articles); // Insert seed data
    console.log("Database seeded with articles!");
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

// Seed database
// seedDatabase();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
