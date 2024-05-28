using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;

        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Retrieve the activity and include attendees
            var activity = await _context.Activities
                                          .Include(x => x.Attendees)
                                          .ThenInclude(x => x.AppUser) // Ensure AppUser is included
                                          .FirstOrDefaultAsync(x => x.Id == request.Id);

            if (activity == null)
            {
                return null;
            }

            // Retrieve the user based on the username from the user accessor
            // var username = _userAccessor.GetUsername();
            // if (username == null) return null;

            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            if (user == null) return null;

            // Find the host's username from the attendees
            var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

            // Find the attendance record for the current user
            var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser != null && x.AppUser.UserName == user.UserName);

            // If user is the host and already attending, toggle activity cancellation
            if (attendance != null && hostUsername == user.UserName)
            {
                activity.IsCancelled = !activity.IsCancelled;
            }
            // If user is attending but not the host, remove them from the attendees
            else if (attendance != null && hostUsername != user.UserName)
            {
                activity.Attendees.Remove(attendance);
            }
            // If user is not attending, add them to the attendees
            else if (attendance == null)
            {
                attendance = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = false
                };
                activity.Attendees.Add(attendance);
            }

            // Save changes to the database and return the result
            var result = await _context.SaveChangesAsync() > 0;
            return result ? Result<Unit>.Success(Unit.Value)
                          : Result<Unit>.Failure("Problem updating attendance");
        }

    }
}
