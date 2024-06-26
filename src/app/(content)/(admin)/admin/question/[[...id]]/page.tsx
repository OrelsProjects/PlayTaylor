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
import {
  Images,
  imagesToUrl,
  urlToImages,
} from "../../../../../../components/dropdown/consts";

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
      image: "Debut",
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
        formik.setFieldValue("image", urlToImages[question.image]);
        if (question.type === "swipe") {
          formik.setFieldValue("title", "");
        } else if (question.type === "sing-the-lyrics") {
          formik.setFieldValue("title", "Sing the lyrics");
        } else if (question.type === "trivia") {
          formik.setFieldValue("title", "What's the meaning of");
        }
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
            onSelect={() => {
              formik.setFieldValue("type", "trivia");
              formik.setFieldValue("title", "What's the meaning of");
            }}
          >
            Trivia
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              formik.setFieldValue("type", "swipe");
              formik.setFieldValue("title", "");
              formik.setFieldValue("answer", "true");
            }}
          >
            Swipe
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              formik.setFieldValue("type", "sing-the-lyrics");
              formik.setFieldValue("title", "Sing the lytics");
            }}
          >
            Sing the lyrics
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
        defaultImage={formik.values.image as Images}
      />

      {formik.values.type === "swipe" ? (
        // True false dropdown
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              className="w-full rounded-md text-start justify-start hover:bg-transparent bg-transparent text-primary"
            >
              {formik.values.answer.charAt(0).toUpperCase() +
                formik.values.answer.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent error={formik.errors.answer} className="w-full">
            <DropdownMenuItem
              onSelect={() => formik.setFieldValue("answer", "true")}
              className="w-full"
            >
              True
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full"
              onSelect={() => formik.setFieldValue("answer", "false")}
            >
              False
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Input
          error={formik.errors.answer}
          name="answer"
          placeholder="Answer"
          value={formik.values.answer}
          onChange={formik.handleChange}
          required
        />
      )}

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

      <Button type="submit" className="text-primary-foreground rounded-md">
        {isEdit ? "Update" : "Create"}
      </Button>
    </form>
  );
}
