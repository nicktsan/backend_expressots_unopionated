
import { NextFunction, Request, RequestHandler, Response } from "express";
// import { packageResolver } from "@expressots/core/lib/cjs/types/common/package-resolver";
import { StatusCode, Logger } from "@expressots/core";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
export function ValidateReqQueryDTO<T extends object>(type: new () => T): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = new Logger();
  
      try {
        const errors = await validate(
          plainToClass(type, req.query),
        );
  
        if (errors.length > 0) {
        //   const DTO = errors.reduce((acc, error) => {
        //     if (error.constraints) {
        //       const propertyName = error.property;
        //       if (!acc.some((e) => e.property === propertyName)) {
        //         acc.push({ property: propertyName, messages: [] });
        //       }
  
        //       const target = acc.find((e) => e.property === propertyName);
        //       target.messages.push(...Object.values(error.constraints));
        //     }
        //     return acc;
        //   }, []);
  
          res.status(StatusCode.BadRequest).json({
            errorCode: StatusCode.BadRequest,
            errorMessage: errors,
            // DTO,
          });
        } else {
          next();
        }
      } catch (error) {
        logger.error(
          `An exception occurred while validating the DTO: ${error}`,
          "ValidateReqQueryDTO",
        );
        next(error);
      }
    };
  }