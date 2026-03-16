import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Started Engineering</h4>
                <h5>BIET, Sikar</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Began my engineering journey and developed a strong interest in technology, problem solving, and software development.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Entered Web Developmentr</h4>
                {/* <h5>Self</h5> */}
              </div>
              <h3>2024</h3>
            </div>
            <p>
            Started learning modern web development, focusing on frontend technologies and building interactive websites using tools like HTML, CSS, JavaScript, React, and Tailwind CSS.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MERN Stack Developer</h4>
                <h5>Grass solutions pvt. ltd. jaipur</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Expanded my skills into full-stack development using the MERN stack (MongoDB, Express.js, React, Node.js). Built several personal projects to gain real-world development experience and understand backend architecture.
            </p>
          </div>
            <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>3D Web & Modern UI Development</h4>
                {/* <h5></h5> */}
              </div>
              <h3>Now</h3>
            </div>
            <p>
           Currently focusing on creating modern web interfaces and immersive 3D web experiences using technologies like Three.js and modern frontend frameworks, while continuing to build full-stack projects with the MERN stack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
