"use client";

import { Button } from "@/components/ui/button";
import { useFormik } from "formik";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Question } from "@/models/question";
import useGame from "../../../../../../lib/hooks/useGame";
import ImagesDropdown from "../../../../../../components/dropdown/imagesDropdown";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function NewQuestionPage({
  params,
}: {
  params: { id: string[] };
}) {
  const router = useRouter();
  const { addQuestion, allQuestions, updateQuestion } = useGame();
  const formik = useFormik<Question>({
    initialValues: {
      id: "",
      title: "",
      content: "",
      image: "",
      answer: "",
      type: "trivia",
      difficulty: "debut",
    },
    onSubmit: async values => {
      if (isEdit) {
        const questionId = params.id[0];
        updateQuestion(questionId, values);
      } else {
        addQuestion(values);
      }
      router.push("/admin");
    },
    onReset: () => {
      formik.resetForm();
    },
  });

  const isEdit = useMemo(() => params.id && params.id.length > 0, [params.id]);

  useEffect(() => {
    if (params.id && params.id.length > 0) {
      const question = allQuestions.find(q => q.id === params.id[0]);
      if (question) {
        formik.setValues(question);
      }
    }
  }, [params.id, allQuestions]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
      className="container mx-auto py-10 flex flex-col gap-4"
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            className="w-fit rounded-md text-start justify-start px-10 hover:bg-transparent bg-primary text-primary-foreground"
          >
            {formik.values.type.charAt(0).toUpperCase() +
              formik.values.type.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent error={formik.errors.type}>
          <DropdownMenuItem
            onSelect={() => formik.setFieldValue("type", "trivia")}
          >
            Trivia
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => formik.setFieldValue("type", "swipe")}
          >
            Swipe
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => formik.setFieldValue("type", "sing-the-lyrics")}
          >
            Sing the lyrics
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        error={formik.errors.title}
        name="title"
        placeholder="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        required
      />
      <Input
        error={formik.errors.content}
        name="content"
        placeholder="Content"
        value={formik.values.content}
        onChange={formik.handleChange}
        required
      />

      <ImagesDropdown
        onImageSelect={image => formik.setFieldValue("image", image)}
      />

      <Input
        error={formik.errors.answer}
        name="answer"
        placeholder="Answer"
        value={formik.values.answer}
        onChange={formik.handleChange}
        required
      />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            className="w-fit rounded-md text-start justify-start px-10 hover:bg-transparent bg-primary text-primary-foreground"
          >
            {formik.values.difficulty.charAt(0).toUpperCase() +
              formik.values.difficulty.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent error={formik.errors.type}>
          <DropdownMenuItem
            onSelect={() => formik.setFieldValue("difficulty", "debut")}
          >
            Debut
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => formik.setFieldValue("difficulty", "midnights")}
          >
            Midnights
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => formik.setFieldValue("difficulty", "folklore")}
          >
            Folklore
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button type="submit" className="text-primary-foreground">
        {isEdit ? "Update" : "Create"}
      </Button>
    </form>
  );
}
