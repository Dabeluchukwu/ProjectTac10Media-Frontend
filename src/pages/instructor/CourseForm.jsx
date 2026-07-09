import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseById, createCourse, updateCourse } from "../../api/courseApi";
import { getExamByCourse, createExam, updateExam } from "../../api/examApi";
import ExamSection from "./ExamSection";
import { toast } from "react-hot-toast";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    duration: "",
    level: "beginner",
    image: "",
    learningOutcomes: [],
    requirements: [],
    modules: [],
    isPublished: false,
  });

  // ✅ Local input state for comma-separated fields
  const [learningOutcomesInput, setLearningOutcomesInput] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");

  // ✅ Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // ✅ Exam state
  const [examData, setExamData] = useState(null);
  const [hasExam, setHasExam] = useState(false);

  // Fetch course if editing
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: isEditing,
  });

  // ✅ Fetch exam if editing
  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ["exam", id],
    queryFn: () => getExamByCourse(id),
    enabled: isEditing,
    retry: false,
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (course && isEditing) {
      const learningOutcomes = course.learningOutcomes || [];
      const requirements = course.requirements || [];

      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || 0,
        duration: course.duration || "",
        level: course.level || "beginner",
        image: course.image || "",
        learningOutcomes: learningOutcomes,
        requirements: requirements,
        modules: course.modules || [],
        isPublished: course.isPublished || false,
      });

      // ✅ Update local input values
      setLearningOutcomesInput(learningOutcomes.join(", "));
      setRequirementsInput(requirements.join(", "));

      // ✅ Set image preview if course has an image
      if (course.image) {
        setImagePreview(course.image);
      }
    }
  }, [course, isEditing]);

  // ✅ Populate exam when editing
  useEffect(() => {
    if (exam && isEditing) {
      setExamData(exam);
      setHasExam(true);
    } else {
      setExamData(null);
      setHasExam(false);
    }
  }, [exam, isEditing]);

  // ✅ Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // ✅ Upload to Cloudinary
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      toast.error("Cloudinary is not configured");
      setIsImageUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "course_images");

    setIsImageUploading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      // ✅ Save the Cloudinary URL to formData
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsImageUploading(false);
    }
  };

  // Mutation for create/update
  const mutation = useMutation({
    mutationFn: async (data) => {
      let courseResult;
      if (isEditing) {
        courseResult = await updateCourse(id, data.course);
      } else {
        courseResult = await createCourse(data.course);
      }

      // ✅ Handle exam creation/update
      if (data.exam && data.exam.questions && data.exam.questions.length > 0) {
        const examPayload = {
          ...data.exam,
          course: courseResult._id || id,
        };

        if (hasExam && exam) {
          await updateExam(exam._id, examPayload);
        } else {
          await createExam(examPayload);
        }
      }

      return courseResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["instructor-courses"]);
      navigate("/instructor/courses");
    },
    onError: (error) => {
      console.error("Error saving course:", error);
      toast.error(error?.response?.data?.message || "Failed to save course");
    },
  });

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle array fields with local state
  const handleLearningOutcomesChange = (e) => {
    const value = e.target.value;
    setLearningOutcomesInput(value);
    const items = value.split(",").map(item => item.trim()).filter(item => item.length > 0);
    setFormData((prev) => ({
      ...prev,
      learningOutcomes: items,
    }));
  };

  const handleRequirementsChange = (e) => {
    const value = e.target.value;
    setRequirementsInput(value);
    const items = value.split(",").map(item => item.trim()).filter(item => item.length > 0);
    setFormData((prev) => ({
      ...prev,
      requirements: items,
    }));
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      modules[moduleIndex] = {
        ...modules[moduleIndex],
        [field]: value,
      };
      return { ...prev, modules };
    });
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      const lessons = [...modules[moduleIndex].lessons];
      lessons[lessonIndex] = {
        ...lessons[lessonIndex],
        [field]: value,
      };
      modules[moduleIndex].lessons = lessons;
      return { ...prev, modules };
    });
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { title: "", description: "", lessons: [], order: prev.modules.length },
      ],
    }));
  };

  const removeModule = (index) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const addLesson = (moduleIndex) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      modules[moduleIndex].lessons = [
        ...modules[moduleIndex].lessons,
        {
          title: "",
          description: "",
          videoUrl: "",
          resourceUrl: "",
          duration: "",
          order: modules[moduleIndex].lessons.length,
        },
      ];
      return { ...prev, modules };
    });
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setFormData((prev) => {
      const modules = [...prev.modules];
      modules[moduleIndex].lessons = modules[moduleIndex].lessons.filter(
        (_, i) => i !== lessonIndex
      );
      return { ...prev, modules };
    });
  };

  // Handle exam data change
  const handleExamChange = (exam) => {
    setExamData(exam);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      course: formData,
      exam: examData,
    });
  };

  if (courseLoading || examLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Course" : "Create New Course"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g., Cinematography Basics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="What will students learn?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Price (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="0 for free"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g., 6 weeks"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* ✅ Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Course Image
              </label>
              <div className="flex items-center gap-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-neutral-700 flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 hover:border-amber-500 transition">
                      <span className="text-white">📤</span>
                      <span className="text-sm text-gray-400">
                        {isImageUploading ? "Uploading..." : "Upload Image"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isImageUploading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {imageFile ? imageFile.name : "Max 5MB, JPG/PNG/WebP"}
                  </p>
                </div>

                {/* Remove Button */}
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, image: "" }));
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcomes & Requirements */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Learning Outcomes & Requirements
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Learning Outcomes (comma separated)
              </label>
              <input
                type="text"
                value={learningOutcomesInput}
                onChange={handleLearningOutcomesChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="Learn camera settings, Master lighting, Understand composition"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate each outcome with a comma
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Requirements (comma separated)
              </label>
              <input
                type="text"
                value={requirementsInput}
                onChange={handleRequirementsChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="Basic camera knowledge, Access to camera"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate each requirement with a comma
              </p>
            </div>
          </div>
        </div>

        {/* Modules & Lessons */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Modules & Lessons</h2>
            <button
              type="button"
              onClick={addModule}
              className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              + Add Module
            </button>
          </div>

          {formData.modules.map((module, moduleIndex) => (
            <div
              key={moduleIndex}
              className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Module {moduleIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeModule(moduleIndex)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove Module
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) =>
                    handleModuleChange(moduleIndex, "title", e.target.value)
                  }
                  placeholder="Module Title"
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={module.description || ""}
                  onChange={(e) =>
                    handleModuleChange(moduleIndex, "description", e.target.value)
                  }
                  placeholder="Module Description (optional)"
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                />

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-400">
                      Lessons
                    </h4>
                    <button
                      type="button"
                      onClick={() => addLesson(moduleIndex)}
                      className="text-amber-400 hover:text-amber-300 text-sm"
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="mb-3 p-3 bg-neutral-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          Lesson {lessonIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Lesson Title"
                          className="col-span-2 bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                        <textarea
                          value={lesson.description || ""}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Description"
                          rows={2}
                          className="col-span-2 bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={lesson.videoUrl || ""}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              "videoUrl",
                              e.target.value
                            )
                          }
                          placeholder="Video URL (YouTube/Vimeo)"
                          className="col-span-2 bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={lesson.resourceUrl || ""}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              "resourceUrl",
                              e.target.value
                            )
                          }
                          placeholder="Resource URL (optional)"
                          className="col-span-2 bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={lesson.duration || ""}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="Duration (e.g., 15 mins)"
                          className="bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        />
                        <select
                          value={lesson.isPreview ? "true" : "false"}
                          onChange={(e) =>
                            handleLessonChange(
                              moduleIndex,
                              lessonIndex,
                              "isPreview",
                              e.target.value === "true"
                            )
                          }
                          className="bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                        >
                          <option value="false">Not Preview</option>
                          <option value="true">Free Preview</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {module.lessons.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No lessons yet. Click "Add Lesson" to get started.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {formData.modules.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No modules yet. Click "Add Module" to start building your course.
            </p>
          )}
        </div>

        {/* ✅ EXAM SECTION */}
        <ExamSection examData={examData} onChange={handleExamChange} />

        {/* Publish */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Publish Course</h3>
              <p className="text-sm text-gray-400">
                {formData.isPublished
                  ? "Course is visible to students"
                  : "Course is in draft mode"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/instructor/courses")}
            className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;