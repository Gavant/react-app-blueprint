import dayjs from 'dayjs';
import { AsYouType, CountryCode } from 'libphonenumber-js';
import { z } from 'zod';

export const emailSchema = z.string().min(1).email("This doesn't look like a valid email address").trim().toLowerCase();

export const firstNameSchema = z.string().min(1, 'Please enter your first name');

export const lastNameSchema = z.string().min(1, 'Please enter your last name');

export const phoneNumberSchema = z
    .object({
        phoneNumber: z.string().optional(),
        phoneNumberCountryCode: z.string(),
    })
    .refine(
        ({ phoneNumber, phoneNumberCountryCode }) => {
            if (!phoneNumber) return true;
            const formatter = new AsYouType({
                defaultCountry: phoneNumberCountryCode as CountryCode,
            });
            formatter.input(phoneNumber.trim());
            return formatter.getNumber()?.isValid();
        },
        { message: "This doesn't look like a valid phone number" }
    );

export const dateOfBirthSchema = z
    .string()
    .min(1, 'Please enter your date of birth')
    .refine((date) => dayjs(date).isValid, {
        message: 'Please enter a valid date',
    })
    .refine((date) => dayjs(date).diff(dayjs(), 'years') * -1 > 0, {
        message: 'This date is in the future',
    });

export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password cannot be more than 30 characters long');
