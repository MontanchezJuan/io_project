import { CopyIcon } from "@chakra-ui/icons";
import { Button, useToast } from "@chakra-ui/react";

interface Props {
  textToCopy: string;
  isWhiteAlpha?: boolean;
}

export const CopyButton = ({ textToCopy, isWhiteAlpha }: Props) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast({
          title: "Copiado.",
          description: "El JSON ha sido copiado al portapapeles.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      (err) => {
        toast({
          title: "Error.",
          description: `Hubo un problema al copiar el JSON. ${err}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    );
  };

  const buttonProps = isWhiteAlpha
    ? { colorScheme: "whiteAlpha" }
    : {
        color: "#fff",
        bgColor: "#472183",
        _hover: { backgroundColor: "#475183" },
      };

  return (
    <Button className="flex gap-2" onClick={handleCopy} {...buttonProps}>
      <CopyIcon /> Copiar JSON
    </Button>
  );
};
